import { ReactElement } from 'react';
import PageHeader from './pageHeader';
import styles from './layout.module.scss';

interface IProps {
  children: ReactElement
}

const BasicLayout = (props: IProps) => {
  return (
		<div className={styles.app}>
      <PageHeader />
      <div className={styles.content}>
        { props.children }
      </div>
		</div>
	);
};

export default BasicLayout;