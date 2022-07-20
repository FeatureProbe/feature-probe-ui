import { useCallback, useEffect, useState, SyntheticEvent, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { Form, Radio, TextArea, CheckboxProps, TextAreaProps } from 'semantic-ui-react';
import { useParams, useHistory, Prompt } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import JSONbig from 'json-bigint';
import { createPatch } from 'diff';
import { html } from 'diff2html/lib/diff2html';
import { FormattedMessage, useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';
import Rules from '../Rules';
import DefaultRule from '../DefaultRule';
import DisabledServe from '../DisabledServe';
import { useBeforeUnload } from '../../hooks';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Variations from 'components/Variations';
import SectionTitle from 'components/SectionTitle';
import { saveToggle } from 'services/toggle';
import { replaceSpace } from 'utils/tools';
import { 
  variationContainer,
  ruleContainer,
  defaultServeContainer,
  disabledServeContainer,
  hooksFormContainer,
  segmentContainer
} from '../../provider';
import { VariationColors } from 'constants/colors';
import { ICondition, IContent, IRule, ITarget, IToggleInfo, IVariation } from 'interfaces/targeting';
import { IRouterParams } from 'interfaces/project';
import { ISegmentList } from 'interfaces/segment';
import 'diff2html/bundles/css/diff2html.min.css';
import styles from './index.module.scss';
import { DATETIME_TYPE, SEGMENT_TYPE } from 'components/Rule/constants';

interface IProps {
  disabled?: boolean;
  targeting?: ITarget;
  toggleInfo?: IToggleInfo;
  toggleDisabled: boolean;
  initialTargeting?: IContent;
  segmentList?: ISegmentList
  initTargeting(): void;
  saveToggleDisable(status: boolean): void;
}

const Targeting = forwardRef((props: IProps, ref: any) => {
  const { disabled, toggleInfo, targeting, toggleDisabled, initialTargeting, segmentList, initTargeting, saveToggleDisable } = props;
  const { rules, saveRules } = ruleContainer.useContainer();
  const { variations, saveVariations } = variationContainer.useContainer();
  const { defaultServe, saveDefaultServe } = defaultServeContainer.useContainer();
  const { disabledServe, saveDisabledServe } = disabledServeContainer.useContainer();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const [ open, setOpen ] = useState<boolean>(false);
  const [ publishDisabled, setPublishDisabled ] = useState<boolean>(true);
  const [ publishTargeting, setPublishTargeting ] = useState<IContent>();
  const [ diffContent, setDiffContent ] = useState<string>('');
  const [ comment, setComment ] = useState<string>('');
  const history = useHistory();
  const intl = useIntl();
  const formRef = useRef();

  useBeforeUnload(!publishDisabled, intl.formatMessage({id: 'targeting.page.leave.text'}));
  useImperativeHandle(ref, () => publishDisabled, [publishDisabled]);

  const {
    formState: {errors},
    setValue,
    setError,
    handleSubmit,
  } = hooksFormContainer.useContainer();

  const {
    saveSegmentList,
  } = segmentContainer.useContainer();

  useEffect(() => {
    if (targeting) {
      const cloneVariations = cloneDeep(targeting.variations) || [];
      cloneVariations.forEach((variation: IVariation) => {
        variation.id = uuidv4();
      });
      saveVariations(cloneVariations);

      const targetRule = cloneDeep(targeting.rules);
      targetRule.forEach((rule: IRule) => {
        rule.id = uuidv4();
        rule.conditions.forEach((condition: ICondition) => {
          condition.id = uuidv4();
          if (condition.type === SEGMENT_TYPE) {
            condition.subject = 'user';
          } else if (condition.type === DATETIME_TYPE && condition.objects) {
            condition.datetime = condition.objects[0].slice(0, 19);
            condition.timezone = condition.objects[0].slice(19);
          }
        });
      });
      saveRules(targetRule);

      saveDefaultServe(targeting.defaultServe);
      saveDisabledServe(targeting.disabledServe);
    }
  }, [targeting, saveVariations, saveRules, saveDefaultServe, saveDisabledServe]);

  useEffect(() => {
    saveSegmentList(segmentList);
  }, [segmentList, saveSegmentList]);

  useEffect(() => {
    rules.forEach((rule: IRule, index: number) => {
      if (rule?.serve?.hasOwnProperty('select')) {
        if (Number(rule?.serve?.select) < variations.length) {
          setValue(`rule_${rule.id}_serve`, rule.serve);
        }
      } else {
        setValue(`rule_${rule.id}_serve`, rule.serve);
      }

      rule.conditions?.forEach((condition: ICondition) => {
        setValue(`rule_${rule.id}_condition_${condition.id}_subject`, condition.subject);
        setValue(`rule_${rule.id}_condition_${condition.id}_predicate`, condition.predicate);

        if (condition.type === DATETIME_TYPE) {
          if (condition.objects) {
            setValue(`rule_${rule.id}_condition_${condition.id}_datetime`, condition.objects[0].slice(0, 19));
            setValue(`rule_${rule.id}_condition_${condition.id}_timezone`, condition.objects[0].slice(19));
          } else {
            setValue(`rule_${rule.id}_condition_${condition.id}_datetime`, moment().format().slice(0, 19));
            setValue(`rule_${rule.id}_condition_${condition.id}_timezone`, moment().format().slice(19));
          }
        } else {
          setValue(`rule_${rule.id}_condition_${condition.id}_objects`, condition.objects);
        }
      });
    });
  }, [rules, variations, setValue]);

  useEffect(()=> {
    if (targeting) {
      variations.forEach((variation: IVariation) => {
        setValue(`variation_${variation.id}_name`, variation.name);
        setValue(`variation_${variation.id}`, variation.value);
      });

      if (disabledServe.hasOwnProperty('select') && Number(disabledServe?.select) < variations.length) {
        setValue('disabledServe', disabledServe);
      }
      if (defaultServe && (typeof(defaultServe.select) !== 'undefined' || typeof(defaultServe.split) !== 'undefined')) {
        setValue('defaultServe', defaultServe);
      }
    }
  }, [variations, targeting, defaultServe, disabledServe, setValue]);

  useEffect(() => {
    const requestRules = cloneDeep(rules);
    requestRules.forEach((rule: IRule) => {
      rule.conditions.forEach((condition: ICondition) => {
        // @ts-ignore
        delete condition.id;

        if (condition.type === SEGMENT_TYPE) {
          // @ts-ignore
          delete condition.subject;
        } else if (condition.type === DATETIME_TYPE) {
          let result = [];
          result.push('' + condition.datetime + condition.timezone);
          condition.objects = result;
          delete condition.datetime;
          delete condition.timezone;
        }
      });
      // @ts-ignore
      delete rule.id;
    });

    const requestVariations = cloneDeep(variations);
    requestVariations.forEach((variation: IVariation) => {
      // @ts-ignore
      delete variation.id;
    });

    setPublishTargeting({
      disabled: toggleDisabled,
      content: {
        rules: requestRules,
        disabledServe,
        defaultServe,
        variations: requestVariations,
      }
    })
  }, [toggleDisabled, rules, variations, defaultServe, disabledServe]);

  useEffect(() => {
    if (initialTargeting) {
      const isSame = isEqual(publishTargeting, initialTargeting);
      setPublishDisabled(isSame);
    }
  }, [publishTargeting, initialTargeting]);

  const onSubmit = useCallback(() => {
    let isError = false;
    const clonevariations: IVariation[] = cloneDeep(variations);
    clonevariations.forEach((variation: IVariation) => {
      let res = replaceSpace(variation);
      if (res.value === '') {
        setError(`variation_${variation.id}`, {
          message: intl.formatMessage({id: 'common.input.placeholder'}),
        })
        isError = true;
      }
    });
    if (isError) return;

    const before = JSONbig.stringify(initialTargeting, null, 2);
    const after = JSONbig.stringify(publishTargeting, null, 2);
    const result = createPatch('content', before.replace(/\\n/g, '\n'), after.replace(/\\n/g, '\n'));
    const content = html(result, {
      matching: 'lines',
      outputFormat: 'side-by-side',
      diffStyle: 'word',
      drawFileList: false,
    });

    setDiffContent(content);
    setOpen(true);
  }, [intl, publishTargeting, initialTargeting, variations, setError]);

  const onError = useCallback(() => {
    console.log(errors);
    // message.error(intl.formatMessage({id: 'targeting.publish.error.text'}));
  }, [errors]);

  const handlePublishCancel = useCallback(() => {
    setOpen(false);
    setComment('');
  }, []);

  const handlePublishConfirm = useCallback(async () => {
    setOpen(false);
    if (publishTargeting) {
      const res = await saveToggle(projectKey, environmentKey, toggleKey, {
        comment,
        ...publishTargeting
      });
      if (res.success) {
        message.success(intl.formatMessage({id: 'targeting.publish.success.text'}));
        initTargeting();
        setComment('');
      }
    }
  }, [intl, comment, projectKey, environmentKey, toggleKey, publishTargeting, initTargeting])

  const handleGoBack = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/toggles`);
  }, [history, projectKey, environmentKey]);

  const disabledText = useMemo(() => {
    if (variations[disabledServe.select]) {
      return variations[disabledServe.select].name 
      || variations[disabledServe.select].value
    }
  }, [disabledServe.select, variations]);

  const handleInputComment = useCallback((e: SyntheticEvent, data: TextAreaProps) => {
    // @ts-ignore
    setComment(data.value);
  }, []);

	return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} autoComplete='off' ref={formRef}>
      <div className={styles.status}>
        <SectionTitle title={intl.formatMessage({id: 'targeting.status.text'})} />
        <div className={styles['toggle-status']}>
          <Radio
            size='mini'
            toggle 
            checked={!toggleDisabled} 
            onChange={(e: SyntheticEvent, data: CheckboxProps) => saveToggleDisable(!data.checked || false)} 
            className={styles['info-toggle-status']} 
            disabled={disabled}
          />
        </div>
        {
          toggleDisabled ? (
            <div className={styles['status-text']}>
              <FormattedMessage id='targeting.status.disabled.text' />
              <span className={styles['name-color']} style={{background: VariationColors[Number(disabledServe.select) % 20]}}></span>
              <span className={styles['name-text']}>
                 {disabledText}
              </span>
            </div>
          ) : (
            <div className={styles['status-text']}>
              <FormattedMessage id='common.enabled.text' />
            </div>
          )
        }
      </div>

      <div className={styles.variations}>
        <SectionTitle
          title={intl.formatMessage({id: 'common.variations.text'})}
          showTooltip={true}
          tooltipText={intl.formatMessage({id: 'toggles.variations.tips'})}
        />
        <Variations
          disabled={disabled}
          returnType={toggleInfo?.returnType || ''}
          hooksFormContainer={hooksFormContainer}
          variationContainer={variationContainer}
        />
      </div>
      <div className={styles.rules}>
        <Rules 
          disabled={disabled}
          useSegment={true}
          ruleContainer={ruleContainer}
          variationContainer={variationContainer}
          hooksFormContainer={hooksFormContainer}
          segmentContainer={segmentContainer}
        />
        <DefaultRule 
          disabled={disabled}
        />
        <DisabledServe 
          disabled={disabled}
        />
      </div>
      <div id='footer' className={styles.footer}>
        <Button className={styles['publish-btn']} disabled={publishDisabled || disabled} primary type="submit">
          <FormattedMessage id='common.publish.text' />
        </Button>
        <Button basic type='reset' onClick={handleGoBack}>
          <FormattedMessage id='common.cancel.text' />
        </Button>
      </div>
      <Modal 
        open={open}
        width={800}
        handleCancel={handlePublishCancel}
        handleConfirm={handlePublishConfirm}
      >
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='targeting.publish.modal.title' />
            </span>
            <Icon customClass={styles['modal-close-icon']} type='close' onClick={handlePublishCancel} />
          </div>
          <div className={styles['modal-content']}>
            <div className="diff" dangerouslySetInnerHTML={{ __html: diffContent }} />
            <div className={styles['comment']}>
              <div className={styles['comment-title']}>
                <FormattedMessage id='targeting.publish.modal.comment' />
              </div>
              <div className={styles['comment-content']}>
                <Form>
                  <TextArea
                    className={styles['comment-input']} 
                    placeholder={intl.formatMessage({id: 'common.input.placeholder'})}
                    onChange={handleInputComment}
                  />
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Prompt
        when={!publishDisabled}
        message={intl.formatMessage({id: 'targeting.page.leave.text'})}
      />
    </Form>
	)
})

export default Targeting;
