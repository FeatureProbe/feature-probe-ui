import { useCallback } from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import ProjectLayout from 'layout/projectLayout';
import Steps from './components/Steps';
import Icon from 'components/Icon';
import styles from './index.module.scss';

const GetStarted = () => {
  const history = useHistory();

  const gotoProjects = useCallback(() => {
    history.push('/projects');
  }, [history]);

  return (
    <ProjectLayout>
      <div className={styles['get-started']}>
      {/* <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Section link onClick={gotoProjects}>
          <FormattedMessage id='common.projects.text' />
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
        <Breadcrumb.Section active>
          <FormattedMessage id='common.get.started.text' />
        </Breadcrumb.Section>
      </Breadcrumb> */}
      <Steps />
    </div>
    </ProjectLayout>
  )
}

export default GetStarted;