
import { useState, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getProjectList } from 'services/project';
import message from 'components/MessageBox';
import StepFirst from '../StepFirst';
import StepFourth from '../StepFourth';
import StepSecond from '../StepSecond';
import StepThird from '../StepThird';
import { IProject } from 'interfaces/project';
import styles from './index.module.scss';

const Steps = () => {
  const intl = useIntl();
  const [ projectList, saveProjectList ] = useState<IProject[]>([]);

  const init = useCallback(async () => {
    const res = await getProjectList<IProject[]>();
    const { data } = res;
    if (res.success && data) {
      saveProjectList(data);
    } else {
      message.error(res.message || intl.formatMessage({id: 'projects.list.error.text'}))
    }
  }, [intl]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div className={styles['intro-title']}>
          <FormattedMessage id='common.get.started.text' />
        </div>
        <div className={styles['intro-desc']}>
          Connect your application to FeatureProbe!!
        </div>
      </div>
      <div className={styles.steps}>
        <StepFirst 
          projectList={projectList}
        />
        <StepSecond />
        <StepThird />
        <StepFourth />
      </div>
    </div>
  )
}

export default Steps;