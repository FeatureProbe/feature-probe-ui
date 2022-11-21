import { SyntheticEvent, useEffect, useCallback, useState, useMemo } from 'react';
import { Form, InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import FormItemDescription from 'components/FormItem/description';
import { addProject, checkProjectExist, editProject } from 'services/project';
import { replaceSpace } from 'utils/tools';
import { CONFLICT } from 'constants/httpCode';
import { useRequestTimeCheck } from 'hooks';

import styles from './index.module.scss';

interface IProps {
  isAdd: boolean;
  visible: boolean;
  setDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const WebHookDrawer = (props: IProps) => {
  const { isAdd, visible, setDrawerVisible } = props;
  const [isKeyEdit, saveKeyEdit] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const intl = useIntl();

  const drawerCls = classNames(styles['webhook-drawer'], {
    [styles['webhook-drawer-inactive']]: visible,
  });

  const formCls = classNames(styles['webhook-drawer-form'], {
    [styles['webhook-drawer-form-inactive']]: visible,
  });

  return (
    <div className={drawerCls}>
      <Form className={formCls} autoComplete="off">
        <div className={styles.title}>
          <div className={styles['title-left']}>
            {isAdd
              ? intl.formatMessage({ id: 'projects.create.project' })
              : intl.formatMessage({ id: 'projects.edit.project' })}
          </div>
          <Button
            loading={submitLoading}
            size="mini"
            primary
            type="submit"
          >
            {isAdd ? intl.formatMessage({ id: 'common.create.text' }) : intl.formatMessage({ id: 'common.save.text' })}
          </Button>
          <div className={styles.divider}></div>
          <Icon customclass={styles['title-close']} type="close" onClick={() => setDrawerVisible(false)} />
        </div>
      </Form>
    </div>
  );
};

export default WebHookDrawer;
