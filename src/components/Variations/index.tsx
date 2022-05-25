import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import VariationItem from 'components/VariationItem';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { IVariation } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import styles from './index.module.scss';
interface IProps {
  returnType: string;
  prefix?: string;
  variationContainer: IContainer;
  hooksFormContainer: IContainer
}

const Variations = (props: IProps) => {
  const { returnType, prefix, variationContainer, hooksFormContainer } = props;

  const {
    variations,
    handleAdd,
    handleInput,
    handleDelete,
    handleChangeVariation,
  } = variationContainer.useContainer();

  const {
    unregister,
  } = hooksFormContainer.useContainer();

  const handleDeleteVariation = useCallback((index: number, variationId: string) => {
    unregister(`variation_${variationId}`);
    handleDelete(index);
  }, [handleDelete, unregister]);

	return (
		<div className={styles.variation}>
      {
         variations?.map((variation: IVariation, index: number) => (
          <VariationItem
            key={variation.id}
            returnType={returnType}
            total={variations.length}
            item={{
              index, 
              ...variation
            }}
            prefix={prefix}
            handleInput={handleInput}
            handleDelete={() => handleDeleteVariation(index, variation.id)}
            handleChangeVariation={handleChangeVariation}
            hooksFormContainer={hooksFormContainer}
          />
        ))
      }

      <div className={styles[`${prefix ? (prefix + '-') : ''}variation-add`]}>
        <Button 
          primary
          type='button'
          onClick={handleAdd}
          disabled={variations.length >= 20} 
          className={styles['variation-add-btn']} 
        >
          <>
            <Icon customClass={styles['iconfont']} type='add' />
            <span className={styles['variation-add-btn-text']}>
              <FormattedMessage id='variations.add.text' />
            </span>
          </>
        </Button>
      </div>
		</div>
	)
}

export default Variations;