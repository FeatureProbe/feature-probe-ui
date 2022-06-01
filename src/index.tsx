import React from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import Router from './router';
import { I18NContainer } from './hooks';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import Intl from './locales/intl';
import 'iconfont/iconfont.css';
import 'semantic-ui-less/semantic.less';
import 'dayjs/locale/zh-cn';

import './index.scss';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

ReactDOM.render(
  <React.StrictMode>
    <I18NContainer.Provider>
      <Intl>
        <Router />
      </Intl>
    </I18NContainer.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
