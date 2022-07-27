import { SyntheticEvent, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Table } from 'semantic-ui-react';
import Icon from 'components/Icon';
import { getToggleInfo } from 'services/toggle';
import { variationContainer, toggleInfoContainer } from '../../provider';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import TagsList from 'components/TagsList';
import { IToggle } from 'interfaces/toggle';
import { IToggleInfo } from 'interfaces/targeting';
import styles from './index.module.scss';
import { FormattedMessage } from 'react-intl';

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

interface IProps {
  toggle: IToggle
  setDrawerVisible(visible: boolean): void;
  setIsAdd(isAdd: boolean): void;
}

const ToggleItem = (props: IProps) => {
  const { toggle, setDrawerVisible, setIsAdd } = props;
  const history = useHistory();
  const { projectKey, environmentKey } = useParams<ILocationParams>();
  const [ visible, setVisible ] = useState(false);
  const { saveVariations } = variationContainer.useContainer();
  const { saveToggleInfo, saveOriginToggleInfo } = toggleInfoContainer.useContainer();

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const gotoEditing = useCallback((toggleKey: string) => {
    history.push(`/${projectKey}/${environmentKey}/${toggleKey}/targeting`);
  }, [projectKey, environmentKey, history]);

  const gotoGetStarted = useCallback((e: SyntheticEvent, toggleKey: string) => {
    history.push(`/${projectKey}/${environmentKey}/${toggleKey}/get-started`);
    e.stopPropagation();
  }, [projectKey, environmentKey, history]);

  const handleEditToggle = useCallback((e: SyntheticEvent, toggleKey: string) => {
    e.stopPropagation();

    getToggleInfo<IToggleInfo>(projectKey, environmentKey, toggleKey).then(res => {
      const { data, success } = res;
      if (success && data) {
        const { name, key, returnType, disabledServe, desc, tags, clientAvailability } = data;
        setDrawerVisible(true);
        setIsAdd(false);
        saveVariations(data.variations || []);
  
        saveToggleInfo({
          name,
          key,
          returnType,
          disabledServe,
          desc,
          tags,
          clientAvailability,
        });

        saveOriginToggleInfo({
          name,
          key,
          returnType,
          disabledServe,
          desc,
          tags,
          clientAvailability,
        });
      }
    });
  }, [projectKey, environmentKey, saveToggleInfo, saveOriginToggleInfo, saveVariations, setIsAdd, setDrawerVisible]);

	return (
    <Table.Row
      className={styles['list-item']}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      onClick={() => gotoEditing(toggle.key)}
    >
      <Table.Cell>
        <div className={styles['toggle-info']}>
          <div className={styles['toggle-info-name']}>
            {toggle.name}
          </div>
          <div className={styles['toggle-info-key']}>
            <CopyToClipboardPopup text={toggle.key}>
              <div onClick={(e) => {e.stopPropagation()}} className={styles['toggle-info-key-label']}>
                {toggle.key}
              </div>
            </CopyToClipboardPopup>
          </div>
        </div>
        {
          toggle.desc && (
            <div className={styles['toggle-info-description']}>
              {toggle.desc}
            </div>
          )
        }
      </Table.Cell>
      <Table.Cell>
        {
          toggle.disabled ? (
            <div className={styles['toggle-status']}>
              <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-disabled']}`}></div>
              <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-disabled']}`}>
                <FormattedMessage id='common.disabled.text' />
              </div>
            </div>
          ) : (
            <div className={styles['toggle-status']}>
              <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-enabled']}`}></div>
              <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-enabled']}`}>
                <FormattedMessage id='common.enabled.text' />
              </div>
            </div>
          ) 
        }
      </Table.Cell>
      <Table.Cell>
        <div>
          {toggle.returnType}
        </div>
      </Table.Cell>
      <Table.Cell>
        {
          toggle.tags && toggle.tags.length > 0 ? (
            <TagsList 
              tags={toggle.tags}
              showCount={2}
            />
          ) : (<>-</>)
        }
      </Table.Cell>
      <Table.Cell>
        {
          toggle.visitedTime ? (
            <div className={styles['toggle-evaluated']}>
              <div>
                <Icon type='evaluate' customClass={styles['icon-evaluate']} />
                <span>
                  <FormattedMessage id='toggles.evaluated.text' /> 
                  {dayjs(toggle?.visitedTime).fromNow()}
                </span>
              </div>
            </div> 
          ) : (
            <div className={styles['toggle-evaluated']}>
              <div>
                <FormattedMessage id='toggles.evaluated.novisit' /> 
              </div>
              <div className={styles['toggle-evaluated-tips']}>
                <span className={styles['toggle-evaluated-tips-link']} onClick={(e: SyntheticEvent) => gotoGetStarted(e, toggle.key)}>
                  <FormattedMessage id='toggle.evaluated.link.sdk' /> 
                </span>
                <FormattedMessage id='toggle.evaluated.check.status' /> 
              </div>
            </div>
          )
        }
      </Table.Cell>
      <Table.Cell>
        <div className={styles['toggle-modified']}>
          <div className={styles['toggle-modified-by']}>
            {toggle.modifiedBy}
          </div>
          <div className={styles['toggle-modified-time']}>
            <FormattedMessage id='toggles.updated.text' />
            {dayjs(toggle?.modifiedTime).fromNow()}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        {
          visible ? (
            <div className={styles['toggle-operation']}>
              <div className={styles['toggle-operation-item']} onClick={(e) => handleEditToggle(e, toggle.key)}>
                <FormattedMessage id='common.edit.text' />
              </div>
            </div>
          ) : (
            <div className={styles['toggle-operation']}></div>
          )
        }
      </Table.Cell>
    </Table.Row>
	)
}

export default ToggleItem;