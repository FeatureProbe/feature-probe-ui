import { useCallback, useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import EnvironmentCard from '../EnvironmentCard';
import EnvironmentModal from '../EnvironmentModal';
import { projectContainer } from '../../provider';
import { IEnvironment, IProject } from 'interfaces/project';
import styles from './index.module.scss';

interface IProps {
  project: IProject;
  handleEditProject(projectKey: string): void;
  refreshProjectsList(): void;
}

const ProjectCard = (props: IProps) => {
  const { project, handleEditProject, refreshProjectsList } = props;
  const [ modalOpen, setModalOpen ] = useState<boolean>(false);
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
  const [ isAddEnvironment, setIsAddEnvironment ] = useState<boolean>(true);

  const {
    saveProjectInfo,
  } = projectContainer.useContainer();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // @ts-ignore
      if (e.target?.id === `${project.key}-icon-more`) {
        return;
      } else {
        setMenuOpen(false);
      }
    }
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [project.key]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    refreshProjectsList();
    setModalOpen(false);
  }, [refreshProjectsList]);

  const handleAddEnvironment = useCallback(() => {
    setModalOpen(true);
    setIsAddEnvironment(true);
  }, []);

  const handleEditEnvironment = useCallback(() => {
    setModalOpen(true);
    setIsAddEnvironment(false);
  }, []);

	return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.name}>
            { project.name }
          </div>
          <Popup
            basic
            open={menuOpen}
            on='click'
            position='bottom left'
            className={styles.popup}
            trigger={
              <div onClick={() => {
                setMenuOpen(true);
              }}>
                <Icon id={`${project.key}-icon-more`} customClass={styles['iconfont']} type='more' />
              </div>
            }
          >
            <div className={styles['menu']} onClick={() => {setMenuOpen(false)}}>
              <div className={styles['menu-item']} onClick={() => {
                saveProjectInfo({
                  name: project.name,
                  key: project.key,
                  description: project.description,
                });
                handleEditProject(project.key);
              }}>
                <FormattedMessage id='projects.menu.edit.project' />
              </div>
              <div className={styles['menu-item']} onClick={handleAddEnvironment}>
                <FormattedMessage id='projects.menu.add.environment' />
              </div>
            </div>
          </Popup>
        </div>
        <div className={styles.key}>
          <span className={styles['key-label']}>
            { project.key }
          </span>
          </div>
        <div className={styles.desc}>
          { project.description }
        </div>
      </div>
      <div className={styles.content}>
        {
          project.environments.map((env: IEnvironment, index: number) => {
            return (
              <EnvironmentCard
                key={env.key}
                index={index}
                item={env}
                projectKey={project.key}
                handleEditEnvironment={handleEditEnvironment}
              />
            )
          })
        }
      </div>
      <EnvironmentModal
        open={modalOpen}
        isAdd={isAddEnvironment}
        projectKey={project.key}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
      />
    </div>
	)
}

export default ProjectCard;
