import { IntlShape } from 'react-intl';

interface IOption {
  intl: IntlShape;
  returnType: string;
  userWithCode: string;
  remoteUrl: string;
  sdkVersion?: string;
  toggleKey?: string;
  serverSdkKey?: string;
  clientSdkKey?: string;
}

export const getJavaCode = (options: IOption) => {
  const { intl, sdkVersion, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;
  return [
    {
      title: intl.formatMessage({id: 'getstarted.java.first.step'}),
      name: intl.formatMessage({id: 'getstarted.java.first.step.name.one'}),
      code: 'mvn archetype:generate -DgroupId=com.featureprobe.demo -DartifactId=featureprobe-java-demo'
    },
    {
      name: intl.formatMessage({id: 'getstarted.java.first.step.name.two'}),
      code:
`<dependency>
  <groupId>com.featureprobe</groupId>
  <artifactId>server-sdk-java</artifactId>
  <version>${sdkVersion}</version>
</dependency>
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.java.second.step'}),
      code:
`private static final FPConfig config = FPConfig.builder()
        .remoteUri("${remoteUrl}")
        .build();

private static final FeatureProbe fpClient = new FeatureProbe("${serverSdkKey}", config);
`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.java.third.step'}),
      code: 
`FPUser user = new FPUser()${userWithCode};
${returnType === 'boolean' ? `boolean boolValue = fpClient.boolValue("${toggleKey}", user, false);` : ''}${returnType === 'string' ? `String stringValue = fpClient.stringValue("${toggleKey}", user, "Test");` : ''}${returnType === 'number' ? `double numberValue = fpClient.numberValue("${toggleKey}", user, 500);` : ''}${returnType === 'json' ? `Map jsonValue = fpClient.jsonValue("${toggleKey}", user, new HashMap(), Map.class);` : ''}
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.fourth.step'}),
      code:
`fpClient.close();
`
    }
  ];
};

export const getRustCode = (options: IOption) => {
  const { intl, sdkVersion, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.rust.first.step'}),
      code: `feature-probe-server-sdk = ${sdkVersion}`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.rust.second.step'}),
      code: 
`use feature_probe_server_sdk::{FPConfig, FPUser, FeatureProbe};
let config = FPConfig {
    remote_url: "${remoteUrl}".to_owned(),
    server_sdk_key: "${serverSdkKey}".to_owned(),
    refresh_interval: Duration::from_secs(1),
    wait_first_resp: true,
};

let fp = match FeatureProbe::new(config).unwrap(); //should check result in production
`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.rust.third.step'}),
      code: 
`let user = FPUser::new();
${userWithCode}
${returnType === 'boolean' ? `let value = fp.bool_value("${toggleKey}", &user, false);` : ''}${returnType === 'number' ? `let value = fp.number_value("${toggleKey}", &user, 20.0), 12.5);` : ''}${returnType === 'string' ? `let value = fp.string_value("${toggleKey}", &user, "val".to_owned()), "value");` : ''}${returnType === 'json' ? `let value = fp.json_value("${toggleKey}", &user, json!("v"));` : ''}
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.fourth.step'}),
      code:
          `fp.close();
`
    }
  ];
};

export const getGoCode = (options: IOption) => {
  const { intl, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;
  return [
    {
      title: intl.formatMessage({id: 'getstarted.go.first.step.title'}),
      name: intl.formatMessage({id: 'getstarted.go.first.step.name.one'}),
      code: 'import "github.com/featureprobe/server-sdk-go"'
    }, 
    {
      name: intl.formatMessage({id: 'getstarted.go.first.step.name.two'}),
      code: 'go get github.com/featureprobe/server-sdk-go'
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.go.second.step.title'}),
      name: intl.formatMessage({id: 'getstarted.go.second.step.name.one'}),
      code: 
`config := featureprobe.FPConfig{
    RemoteUrl:       "${remoteUrl}",
    ServerSdkKey:    "${serverSdkKey}",
    RefreshInterval: 1000,
}
  
fp, err := featureprobe.NewFeatureProbe(config)
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.go.third.step.title'}),
      name: intl.formatMessage({id: 'getstarted.go.third.step.name.one'}),
      code: 
`user := featureprobe.NewUser()
${userWithCode}
${returnType === 'boolean' ? `val := fp.BoolValue("${toggleKey}", user, true)` : ''}${returnType === 'string' ? `val := fp.StrValue("${toggleKey}", user, "1")` : ''}${returnType === 'number' ? `val := fp.NumberValue("${toggleKey}", user, 1.0)` : ''}${returnType === 'json' ? `val := fp.JsonValue("${toggleKey}", user, nil)` : ''}
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.fourth.step'}),
      code:
          `fp.Close();
`
    }
  ];
};

export const getPythonCode = (options: IOption) => {
  const { intl, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.python.first.step'}),
      code: 'pip3 install featureprobe-server-sdk-python'
    },
    {
      title: intl.formatMessage({id: 'getstarted.python.second.step'}),
      code:
`import time
import featureprobe as fp

if __name__ == '__main__':
  config = fp.Config(remote_uri='${remoteUrl}', sync_mode='pooling')
  with fp.Client('${serverSdkKey}', config) as client:
    user = fp.User()
    ${userWithCode}
    val = client.value('${toggleKey}', user, default=${returnType === 'boolean' ? 'False' : ''}${returnType === 'string' ? 'not connected' : ''}${returnType === 'number' ? '-1' : ''}${returnType === 'json' ? '{}' : ''})  
`
    }
  ];
};

export const getAndroidCode = (options: IOption) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl, sdkVersion } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.android.first.step'}),
      code:
`implementation 'com.featureprobe:client-sdk-android:${sdkVersion}@aar'
implementation "net.java.dev.jna:jna:5.7.0@aar"
`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.android.second.step'}),
      code: 
`import com.featureprobe.mobile.*

val url = FpUrlBuilder("${remoteUrl}").build()
val user = FpUser()
${userWithCode}
val config = FpConfig(url!!, "${clientSdkKey}", 10u, true)
val fp = FeatureProbe(config, user)
`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.android.third.step'}),
      code: 
`${returnType === 'boolean' ? `val value = fp.boolValue("${toggleKey}", false)` : ''}${returnType === 'number' ? `val value = fp.numberValue("${toggleKey}", 1.0)` : ''}${returnType === 'string' ? `val value = fp.stringValue("${toggleKey}", "s")` : ''}${returnType === 'json' ? `val value = fp.jsonValue("${toggleKey}", "{}")` : ''}`
    }
  ];
};

export const getSwiftCode = (options: IOption) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.swift.first.step'}),
      name: 'Swift Package Manager:',
      code: 
`1. XCode -> File -> Add Packages -> input \`https://github.com/FeatureProbe/client-sdk-ios.git\`
2. click \`Add Package\`
`
    }, 
    {
      name: 'Cocoapods:',
      code: 
`1. add \`pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'\` to Podfile
2. \`pod install\` or \`pod update\`
`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.swift.second.step'}),
      name: '',
      code: 
`import featureprobe
let url = FpUrlBuilder(remoteUrl: "${remoteUrl}").build()
let user = FpUser()
${userWithCode}
let config = FpConfig(
    remoteUrl: url!,
    clientSdkKey: "${clientSdkKey}",
    refreshInterval: 10,
    waitFirstResp: true
)
let fp = FeatureProbe(config: config, user: user)
`
    }, {
      title: intl.formatMessage({id: 'getstarted.swift.third.step'}),
      name: '',
      code: `${returnType === 'boolean' ? `let value = fp.boolValue("${toggleKey}", false)` : ''}${returnType === 'number' ? `let value = fp.numberValue("${toggleKey}", 1.0)` : ''}${returnType === 'string' ? `let value = fp.stringValue("${toggleKey}", "s")` : ''}${returnType === 'json' ? `let value = fp.jsonValue("${toggleKey}", "{}")` : ''}`
    }
  ];
};

export const getObjCCode = (options: IOption) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.objc.first.step'}),
      name: 'Cocoapods:',
      code: 
`1. add \`pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'\` to Podfile
2. \`pod install\` or \`pod update\`
`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.objc.second.step'}),
      name: '',
      code:
`#import "FeatureProbe-Swift.h"

NSString *urlStr = @"${remoteUrl}";
NSString *userId = /* User id in your business context */;
FpUrl *url = [[[FpUrlBuilder alloc] initWithRemoteUrl: urlStr] build];
FpUser *user = [[FpUser alloc] init];
${userWithCode}
FpConfig *config = [[FpConfig alloc] initWithRemoteUrl: url
                                          clientSdkKey:@"${clientSdkKey}"
                                      refreshInterval: 10
                                        waitFirstResp: true];
FeatureProbe *fp = [[FeatureProbe alloc] initWithConfig:config user:user];`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.objc.third.step'}),
      name: '',
      code: `${returnType === 'boolean' ? `bool value = [fp boolValueWithKey: @"${toggleKey}" defaultValue: false];` : ''}${returnType === 'number' ? `double value = [fp numberValueWithKey: @"${toggleKey}" defaultValue: 1.0];` : ''}${returnType === 'string' ? `NSString* value = [fp stringValueWithKey: @"${toggleKey}" defaultValue: @"s"];` : ''}${returnType === 'json' ? `NSString* value = [fp jsonValueWithKey: @"${toggleKey}" defaultValue: @"{}"];` : ''}`
    }
  ];
};

export const getJSCode = (options: IOption) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;
  return [
    {
      title: intl.formatMessage({id: 'getstarted.js.first.step.title'}),
      name: 'NPM',
      code: 'npm install featureprobe-client-sdk-js --save'
    }, 
    {
      name: intl.formatMessage({id: 'getstarted.js.second.step.or'}) + 'CDN',
      code: '<script type="text/javascript" src="https://unpkg.com/featureprobe-client-sdk-js@latest/dist/featureprobe-client-sdk-js.min.js"></script>'
    },
    {
      title: intl.formatMessage({id: 'getstarted.js.second.step.title'}),
      name: 'NPM',
      code: 
`import { FeatureProbe, FPUser } from "featureprobe-client-sdk-js";

const user = new FPUser();
${userWithCode}
const fp = new FeatureProbe({
    remoteUrl: "${remoteUrl}",
    clientSdkKey: "${clientSdkKey}",
    user,
});

fp.start();
`
    }, 
    {
      name: intl.formatMessage({id: 'getstarted.js.second.step.or'}) + 'CDN',
      code: 
`const user = new featureProbe.FPUser();
${userWithCode}
const fp = new featureProbe.FeatureProbe({
    remoteUrl: "${remoteUrl}",
    clientSdkKey: "${clientSdkKey}",
    user,
});

fp.start();
`
    }, 
    {
      title: intl.formatMessage({id: 'getstarted.js.third.step.title'}),
      name: intl.formatMessage({id: 'getstarted.js.third.step.name.one'}),
      code: 
`fp.on("ready", function() {
    ${returnType === 'boolean' ? `const value = fp.boolValue("${toggleKey}", false);` : ''}${returnType === 'number' ? `const value = fp.numberValue("${toggleKey}", 1.0);` : ''}${returnType === 'string' ? `const value = fp.stringValue("${toggleKey}", "s");` : ''}${returnType === 'json' ? `const value = fp.jsonValue("${toggleKey}", {});` : ''}
});
`
    }
  ];
};
