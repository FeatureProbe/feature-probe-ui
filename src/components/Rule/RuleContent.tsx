import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import Serve from 'components/Serve';
import Icon from 'components/Icon';
import Condition from './condition';
import { IRule, ICondition } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import styles from './index.module.scss';

interface IProps {
  rule: IRule;
  ruleIndex: number;
  useSegment?: boolean;
  ruleContainer: IContainer;
  variationContainer?: IContainer;
  segmentContainer?: IContainer;
  hooksFormContainer: IContainer;
}

const RuleContent = (props: IProps) => {
  const { 
    rule,
    ruleIndex,
    useSegment,
    ruleContainer, 
    segmentContainer,
    variationContainer, 
    hooksFormContainer, 
  } = props;

  let variations;

  if (variationContainer) {
    variations = variationContainer.useContainer().variations;
  }

  const {
    handleAddCondition,
    handleChangeServe,
  } = ruleContainer.useContainer();

	return (
    <div className={styles['rule-content']}>
      {
        rule.conditions?.map((condition: ICondition, index: number) => {
          return (
            <Condition 
              rule={rule}
              ruleIndex={ruleIndex}
              useSegment={useSegment}
              conditionIndex={index}
              condition={condition}
              ruleContainer={ruleContainer}
              segmentContainer={segmentContainer}
              variationContainer={variationContainer}
              hooksFormContainer={hooksFormContainer}
            />
          );
        })
      }

      <div className={styles['rule-add']}>
        <Button type='button' secondary className={styles['rule-add-btn']} onClick={() => handleAddCondition(ruleIndex)}>
          <Icon type='add' customClass={styles.iconfont} />
          <FormattedMessage id='common.add.text' />
        </Button>
      </div>
     
      {
        variations && (
          <Serve
            index={ruleIndex}
            id={rule.id}
            serve={rule.serve}
            variations={variations}
            customStyle={{width: '308px'}}
            handleChangeServe={(item) => handleChangeServe(ruleIndex, item)}
            hooksFormContainer={hooksFormContainer}
          />
        )
      }
    </div>
	)
}

export default RuleContent;