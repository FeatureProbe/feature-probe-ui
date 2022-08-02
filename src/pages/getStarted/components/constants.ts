import { IntlShape } from 'react-intl';

export const getJavaCode = (sdkVersion: string, sdkKey: string, toggleKey: string, returnType: string, intl: IntlShape, userWithCode: string) => [
  {
    title: intl.formatMessage({id: 'getstarted.java.first.step'}),
    code: 'mvn archetype:generate -DgroupId=com.featureprobe.demo -DartifactId=featureprobe-java-demo'
  }, 
  {
    title: intl.formatMessage({id: 'getstarted.java.second.step'}),
    code: 
`<dependency>
  <groupId>com.featureprobe</groupId>
  <artifactId>server-sdk-java</artifactId>
  <version>${sdkVersion}</version>
</dependency>
`
  }, 
  {
    title: intl.formatMessage({id: 'getstarted.java.third.step'}),
    code: 
`public class Demo {
    private static final FPConfig config = FPConfig.builder()
            .remoteUri("http://127.0.0.1:4007")
            .pollingMode(Duration.ofSeconds(3))
            .useMemoryRepository()
            .build();

    private static final FeatureProbe fpClient = new FeatureProbe("${sdkKey}", config);

    public void test() {
        String uniqueUserId = $uniqueUserId;
        FPUser user = new FPUser(uniqueUserId)${userWithCode};
        ${returnType === 'boolean' ? `boolean boolValue = featureProbe.boolValue("${toggleKey}", user, false);` : ''}${returnType === 'string' ? `String stringValue = featureProbe.stringValue("${toggleKey}", user, "Test");` : ''}${returnType === 'number' ? `double numberValue = featureProbe.numberValue("${toggleKey}", user, 500);` : ''}${returnType === 'json' ? `Map jsonValue = featureProbe.jsonValue("${toggleKey}", user, new HashMap(), Map.class);` : ''}}}
`
  }
];

export const getRustCode = (sdkVersion: string, sdkKey: string, toggleKey: string, returnType: string, intl: IntlShape, userWithCode: string) => [
  {
    title: intl.formatMessage({id: 'getstarted.rust.first.step'}),
    code: `feature-probe-server-sdk = ${sdkVersion}`
  }, 
  {
    title: intl.formatMessage({id: 'getstarted.rust.second.step'}),
    code: 
`use feature_probe_server_sdk::{FPConfig, FPUser, FeatureProbe};
let config = FPConfig {
    remote_url: "http://localhost:4007".to_owned(),
    server_sdk_key: "${sdkKey}".to_owned(),
    refresh_interval: Duration::from_secs(1),
    wait_first_resp: true,
};

let fp = match FeatureProbe::new(config).unwrap(); //should check result in production
`
  }, 
  {
    title: intl.formatMessage({id: 'getstarted.rust.third.step'}),
    code: 
`let unique_user_id = $unique_user_id;
let user = FPUser::new(unique_user_id);
${userWithCode}
${returnType === 'boolean' ? `let value = fp.bool_value("${toggleKey}", &user, false);` : ''}${returnType === 'number' ? `let value = fp.number_value("${toggleKey}", &user, 20.0), 12.5);` : ''}${returnType === 'string' ? `let value = fp.string_value("${toggleKey}", &user, "val".to_owned()), "value");` : ''}${returnType === 'json' ? `let value = fp.json_value("${toggleKey}", &user, json!("v"));` : ''}
`
  }
];

export const getGoCode = (sdkKey: string, toggleKey: string, returnType: string, intl: IntlShape, userWithCode: string) => [
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
    RemoteUrl:       "https://127.0.0.1:4007",
    ServerSdkKey:    "${sdkKey}",
    RefreshInterval: 1000,
}
  
fp, err := featureprobe.NewFeatureProbe(config)
`
  },
  {
    title: intl.formatMessage({id: 'getstarted.go.third.step.title'}),
    name: intl.formatMessage({id: 'getstarted.go.third.step.name.one'}),
    code: 
`uniqueUserId := $uniqueUserId
user := featureprobe.NewUser(uniqueUserId)
${userWithCode}
${returnType === 'boolean' ? `val := fp.BoolValue("${toggleKey}", user, true)` : ''}${returnType === 'string' ? `val := fp.StrValue("${toggleKey}", user, "1")` : ''}${returnType === 'number' ? `val := fp.NumberValue("${toggleKey}", user, 1.0)` : ''}${returnType === 'json' ? `val := fp.JsonValue("${toggleKey}", user, nil)` : ''}
`
  }
];

export const getPythonCode = (sdkVersion: string, sdkKey: string, toggleKey: string, returnType: string, intl: IntlShape, userWithCode: string) => [];

export const getAndroidCode = (sdkVersion: string, sdkKey: string, toggleKey: string, returnType: string, intl: IntlShape, userWithCode: string) => [
  {
    title: intl.formatMessage({id: 'getstarted.android.first.step'}),
    code: 
`implementation 'com.featureprobe.mobile:android_sdk:${sdkVersion}@aar'
implementation "net.java.dev.jna:jna:5.7.0@aar"
`
  }, 
  {
    title: intl.formatMessage({id: 'getstarted.android.second.step'}),
    code: 
`import com.featureprobe.mobile.*;
val url = FpUrlBuilder("remote_url/").build();
val uniqueUserId = $uniqueUserId
val user = FpUser(uniqueUserId)
${userWithCode}
val config = FpConfig(url!!, "${sdkKey}", 10u, true)
val fp = FeatureProbe(config, user)
`
  }, 
  {
    title: intl.formatMessage({id: 'getstarted.android.third.step'}),
    code: 
`${returnType === 'boolean' ? `val value = fp.boolValue("${toggleKey}", false)` : ''}${returnType === 'number' ? `val value = fp.numberValue("${toggleKey}", 1.0)` : ''}${returnType === 'string' ? `val value = fp.stringValue("${toggleKey}", "s")` : ''}${returnType === 'json' ? `val value = fp.jsonValue("${toggleKey}", "{}")` : ''}
`
  }
];

export const getSwiftCode = (sdkKey: string, toggleKey: string, returnType: string, intl: IntlShape, userWithCode: string) => [
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
let url = FpUrlBuilder(remoteUrl: "remote_url/").build()
let uniqueUserId = $uniqueUserId
let user = FpUser(key: uniqueUserId)
${userWithCode}
let config = FpConfig(
    remoteUrl: url!,
    clientSdkKey: "${sdkKey}",
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

export const getObjCCode = (sdkKey: string, toggleKey: string, returnType: string, intl: IntlShape, userWithCode: string) => [
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

NSString *urlStr = @"remote_url/";
NSString *uniqueUserId = @$uniqueUserId;
FpUrl *url = [[[FpUrlBuilder alloc] initWithRemoteUrl: urlStr] build];
FpUser *user = [[FpUser alloc] initWithKey: uniqueUserId];
${userWithCode}
FpConfig *config = [[FpConfig alloc] initWithRemoteUrl: url
                                          clientSdkKey:@"${sdkKey}"
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

export const getJSCode = (sdkKey: string, toggleKey: string, returnType: string, intl: IntlShape, userWithCode: string) => [
  {
    title: intl.formatMessage({id: 'getstarted.js.first.step.title'}),
    name: 'npm',
    code: 'npm install featureprobe-client-sdk-js --save'
  }, 
  {
    name: 'CDN',
    code: '<script type="text/javascript" src="https://unpkg.com/featureprobe-client-sdk-js@latest/dist/featureprobe-client-sdk-js.min.js"></script>'
  },
  {
    title: intl.formatMessage({id: 'getstarted.js.second.step.title'}),
    name: intl.formatMessage({id: 'getstarted.js.second.step.name.one'}),
    code: 
`const uniqueUserId = $uniqueUserId;
const user = new featureProbe.FPUser(uniqueUserId);
${userWithCode}
const fp = new featureProbe.FeatureProbe({
    remoteUrl: "https://127.0.0.1:4007",
    clientSdkKey: '${sdkKey}',
    user,
});

fp.start();
`
  }, 
  {
    title: intl.formatMessage({id: 'getstarted.js.third.step.title'}),
    name: intl.formatMessage({id: 'getstarted.js.third.step.name.one'}),
    code: 
`fp.on('ready', function() {
    ${returnType === 'boolean' ? `const value = fp.boolValue('${toggleKey}', false);` : ''}${returnType === 'number' ? `const value = fp.numberValue('${toggleKey}', 1.0);` : ''}${returnType === 'string' ? `const value = fp.stringValue('${toggleKey}', "s");` : ''}${returnType === 'json' ? `const value = fp.jsonValue('${toggleKey}', {});` : ''}
});
`
  }
];