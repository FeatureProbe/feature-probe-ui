import { ReactElement } from 'react';
import PageHeader from './pageHeader';
import { HeaderContainer } from './hooks';
import styles from './layout.module.scss';

interface IProps {
  children: ReactElement
}

const BasicLayout = (props: IProps) => {
  return (
		<div className={styles.app}>
      <HeaderContainer.Provider>
        <PageHeader />
        <div className={styles.content}>
          { props.children }
        </div>
      </HeaderContainer.Provider>
		</div>
	)
}

export default BasicLayout;