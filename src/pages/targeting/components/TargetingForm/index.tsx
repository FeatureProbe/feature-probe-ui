import { useCallback, useEffect, useState, SyntheticEvent, useMemo } from 'react';
import { Form, Radio, CheckboxProps } from 'semantic-ui-react';
import { useParams, useHistory, Prompt } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
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
} from '../../provider';
import { VariationColors } from 'constants/colors';
import { ICondition, IContent, IRule, ITarget, IToggleInfo, IVariation } from 'interfaces/targeting';
import { IRouterParams } from 'interfaces/project';
import styles from './index.module.scss';
import 'diff2html/bundles/css/diff2html.min.css';

interface IProps {
  targeting?: ITarget;
  toggleInfo?: IToggleInfo;
  toggleDisabled: boolean;
  initialTargeting?: IContent;
  initTargeting(): void;
  saveToggleDisable(status: boolean): void;
}

const Targeting = (props: IProps) => {
  const { toggleInfo, targeting, toggleDisabled, initialTargeting, initTargeting, saveToggleDisable } = props;
  const { rules, saveRules } = ruleContainer.useContainer();
  const { variations, saveVariations } = variationContainer.useContainer();
  const { defaultServe, saveDefaultServe } = defaultServeContainer.useContainer();
  const { disabledServe, saveDisabledServe } = disabledServeContainer.useContainer();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const [ open, setOpen ] = useState<boolean>(false);
  const [ publishDisabled, setPublishDisabled ] = useState<boolean>(true);
  const [ publishTargeting, setPublishTargeting ] = useState<IContent>();
  const [ diffContent, setDiffContent ] = useState<string>('');
  const history = useHistory();
  const intl = useIntl();

  useBeforeUnload(!publishDisabled, intl.formatMessage({id: 'targeting.page.leave.text'}));

  const {
    formState: {errors},
    setValue,
    setError,
    handleSubmit,
  } = hooksFormContainer.useContainer();

  useEffect(() => {
    if (targeting) {
      const cloneVariations = cloneDeep(targeting.variations) || [];
      cloneVariations.forEach((variation: IVariation) => {
        variation.id = uuidv4();
      });
      saveVariations(cloneVariations);

      const targetRule = cloneDeep(targeting.rules);
      targetRule.forEach((rule: IRule) => {
        rule.conditions.forEach((condition: ICondition) => {
          condition.id = uuidv4();
        });
        rule.id = uuidv4();
      });
      saveRules(targetRule);

      saveDefaultServe(targeting.defaultServe);
      saveDisabledServe(targeting.disabledServe);
    }
  }, [targeting, saveVariations, saveRules, saveDefaultServe, saveDisabledServe]);

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
        setValue(`rule_${rule.id}_condition_${condition.id}_objects`, condition.objects);
      })
    })
  }, [rules, variations, setValue]);

  useEffect(()=> {
    if (targeting) {
      variations.forEach((variation: IVariation) => {
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
    message.error(intl.formatMessage({id: 'targeting.publish.error.text'}));
  }, [intl, errors]);

  const handlePublishCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const handlePublishConfirm = useCallback(async () => {
    setOpen(false);
    if (publishTargeting) {
      const res = await saveToggle(projectKey, environmentKey, toggleKey, publishTargeting);
      if (res.success) {
        message.success(intl.formatMessage({id: 'targeting.publish.success.text'}));
        initTargeting();
      }
    }
  }, [intl, projectKey, environmentKey, toggleKey, publishTargeting, initTargeting])

  const handleGoBack = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/toggles`);
  }, [history, projectKey, environmentKey]);

  const disabledText = useMemo(() => {
    if (variations[disabledServe.select]) {
      return variations[disabledServe.select].name 
      || variations[disabledServe.select].value 
      || `${intl.formatMessage({id: 'common.variation.text'})} ${Number(disabledServe.select) + 1}`
    }
  }, [intl, disabledServe.select, variations]);

	return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} autoComplete='off'>
      <div className={styles.status}>
        <SectionTitle title={intl.formatMessage({id: 'targeting.status.text'})} />
        <div className={styles['toggle-status']}>
          <Radio
            size='mini'
            toggle 
            checked={!toggleDisabled} 
            onClick={(e: SyntheticEvent, data: CheckboxProps) => saveToggleDisable(!data.checked || false)} 
            className={styles['info-toggle-status']} 
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
          returnType={toggleInfo?.returnType || ''}
          hooksFormContainer={hooksFormContainer}
          variationContainer={variationContainer}
        />
      </div>
      <div className={styles.rules}>
        <Rules 
          ruleContainer={ruleContainer}
          variationContainer={variationContainer}
          hooksFormContainer={hooksFormContainer}
        />
        <DefaultRule />
        <DisabledServe />
      </div>
      <div id='footer' className={styles.footer}>
        <Button className={styles['publish-btn']} disabled={publishDisabled} primary type="submit">
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
          </div>
        </div>
      </Modal>
      <Prompt
        when={!publishDisabled}
        message={intl.formatMessage({id: 'targeting.page.leave.text'})}
      />
    </Form>
	)
}

export default Targeting;
