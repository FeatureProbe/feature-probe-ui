import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Table, Popup } from 'semantic-ui-react';
import TextLimit from 'components/TextLimit';
import styles from './index.module.scss';
import { IToken } from 'interfaces/token';

interface IProps {
  token: IToken;
}

const TokenItem = (props: IProps) => {
  const { token } = props;

  return (
    <Table.Row className={styles['list-item']}>
      <Table.Cell>
        <div className={styles['list-item-name']}></div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['list-item-role']}></div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['list-item-creator']}></div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['list-item-last-time']}></div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['list-item-opt']}>
          <div
            className={styles['token-operation-item']}
            onClick={(e) => {
              //
            }}
          >
            <FormattedMessage id="common.delete.text" />
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export default TokenItem;
