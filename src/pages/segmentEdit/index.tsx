import { FormattedMessage } from 'react-intl';
import { useRouteMatch } from 'react-router-dom';
import ProjectLayout from 'layout/projectLayout';
import Info from './components/Info';
import { Provider } from './provider';
import { SEGMENT_ADD_PATH, SEGMENT_EDIT_PATH } from 'router/routes';

import styles from './index.module.scss';

const SegmentEdit = () => {
  const match = useRouteMatch();

	return (
    <ProjectLayout>
      <Provider>
        <div className={styles.segments}>
          <div className={styles.card}>
            <div className={styles.heading}>
              {
                match.path === SEGMENT_ADD_PATH && <FormattedMessage id='segments.create.text' />
              }
              {
                match.path === SEGMENT_EDIT_PATH && <FormattedMessage id='segments.edit.text' />
              }
            </div>
            <Info />
          </div>
        </div>
      </Provider>
    </ProjectLayout>
	);
};

export default SegmentEdit;
