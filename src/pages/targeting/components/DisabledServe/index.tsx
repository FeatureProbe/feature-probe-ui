import { SyntheticEvent, useEffect } from 'react';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import SectionTitle from 'components/SectionTitle';
import Icon from 'components/Icon';
import { VariationColors } from 'constants/colors';
import { IVariation } from 'interfaces/targeting';
import { variationContainer, disabledServeContainer, hooksFormContainer } from '../../provider';

import styles from './index.module.scss';

const DisabledServe = () => {
  const intl = useIntl();
  const { 
    disabledServe,
    saveDisabledServe,
  } = disabledServeContainer.useContainer();
  const { variations } = variationContainer.useContainer();

  const {
    formState: { errors },
    register,
    setValue,
    trigger,
    setError,
  } = hooksFormContainer.useContainer();

  useEffect(() => {
    if (disabledServe.select >= variations.length) {
      setError('disabledServe', {
        message: intl.formatMessage({id: 'targeting.disabled.return.value.required'})
      });
      setValue('disabledServe', null);
    }
  }, [intl, disabledServe, variations, setError, setValue])

  const options = variations.map((item: IVariation, index: number) => {
    const text = item.name || item.value || `${intl.formatMessage({id: 'common.variation.text'})} ${index + 1}`
    return {
      text,
      value: index,
      content: (
        <div>
          <span style={{ background: VariationColors[index % 20] }} className={styles['variation-name-color']}></span>
          <span>{ text }</span>
        </div>
      ),
    }
  });

  return (
    <div className={styles['disabled-serve']}>
      <SectionTitle
        showTooltip={true}
        title={intl.formatMessage({id: 'targeting.disabled.return.value'})}
        tooltipText={intl.formatMessage({id: 'targeting.disabled.return.value.tips'})}
      />
      <div className={styles['serve-select']}>
        <span className={styles['serve-text']}>
          <span className={styles['label-required']}>*</span>
          Serve
        </span>
        <Dropdown
          selection
          floating
          value={disabledServe?.select}
          className={styles['serve-dropdown']}
          options={options} 
          placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})}
          error={ errors.disabledServe ? true : false }
          {
            ...register('disabledServe', { 
              required: {
                value: true,
                message: intl.formatMessage({id: 'targeting.disabled.return.value.required'})
              },
            })
          }
          onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
            saveDisabledServe({
              // @ts-ignore
              select: detail.value
            });
            setValue(detail.name, detail.value);
            await trigger('disabledServe');
          }}
          icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
        />
      </div>
      { errors.disabledServe && <div className={styles['error-text']}>
        { errors.disabledServe.message }
      </div> }
    </div>
  )
}

export default DisabledServe;