
export const getJavaCode = (sdkVersion: string, sdkKey: string, toggleKey: string, returnType: string) => [
  {
    name: 'step 1. Create a new project（optional）:',
    code: 'mvn archetype:generate -DgroupId=com.featureprobe.demo -DartifactId=featureprobe-java-demo'
  }, {
    name: 'step 2. Add the sdk to your project: ',
    code: 
`<dependency>
  <groupId>com.featureprobe</groupId>
  <artifactId>server-sdk-java</artifactId>
  <version>${sdkVersion}</version>
</dependency>
`
  }, {
    name: 'step 3: Add the following code to your Application',
    code: 
`public class Demo {
    private static final FPConfig config = FPConfig.builder()
            .remoteUri("http://127.0.0.1:4007")
            .pollingMode(Duration.ofSeconds(3))
            .useMemoryRepository()
            .build();

    private static final FeatureProbe fpClient = new FeatureProbe("${sdkKey}", config);

    public void test() {
        FPUser user = new FPUser("user_unique_id");
        user.with("userId", "9876");
        user.with("tel", "12345678998");
        ${returnType === 'boolean' ? `boolean boolValue = featureProbe.boolValue("${toggleKey}", user, false);` : ''}${returnType === 'string' ? `String stringValue = featureProbe.stringValue("${toggleKey}", user, "Test");` : ''}${returnType === 'number' ? `double numberValue = featureProbe.numberValue("${toggleKey}", user, 500);` : ''}${returnType === 'json' ? `Map jsonValue = featureProbe.jsonValue("${toggleKey}", user, new HashMap(), Map.class);` : ''}
    }
}
`
  }
];

export const getRustCode = (sdkVersion: string, sdkKey: string, toggleKey: string, returnType: string) => [
  {
    name: 'step 1: add following in Cargo.toml dependency section',
    code: `feature-probe-server-sdk = "${sdkVersion}"`
  }, {
    name: 'step 2: init sdk instance',
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
  }, {
    name: 'step 3: ',
    code: 
`let user = FPUser::new("user@company.com").with("name", "bob");
${returnType === 'boolean' ? `let value = fp.bool_value("${toggleKey}", &user, false);` : ''}${returnType === 'number' ? `let value = fp.number_value("${toggleKey}", &user, 20.0), 12.5);` : ''}${returnType === 'string' ? `let value = fp.string_value("${toggleKey}", &user, "val".to_owned()), "value");` : ''}${returnType === 'json' ? `let value = fp.json_value("${toggleKey}", &user, json!("v"));` : ''}
`
  }
];

export const getGoCode = (sdkKey: string, toggleKey: string, returnType: string) => [
  {
    title: 'Step 1. Install the Golang SDK',
    name: 'Fisrt import the FeatureProbe SDK in your application code:',
    code: 'import "github.com/featureprobe/server-sdk-go"'
  }, 
  {
    name: 'Fetch the FeatureProbe SDK as a dependency in go.mod.',
    code: 'go get github.com/featureprobe/server-sdk-go'
  }, 
  {
    title: 'Step 2. Create a FeatureProbe instance',
    name: 'After you install and import the SDK, create a single, shared instance of the FeatureProbe sdk.',
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
    title: 'Step 3. Use the feature toggle',
    name: 'You can use sdk to check which variation a particular user will receive for a given feature flag.',
    code: 
`user := featureprobe.NewUser("user")
${returnType === 'boolean' ? `val := fp.BoolValue("${toggleKey}", user, true)` : ''}${returnType === 'string' ? `val := fp.StrValue("${toggleKey}", user, "1")` : ''}${returnType === 'number' ? `val := fp.NumberValue("${toggleKey}", user, 1.0)` : ''}${returnType === 'json' ? `val := fp.JsonValue("${toggleKey}", user, nil)` : ''}
`
  }
];

export const getPythonCode = (sdkVersion: string, sdkKey: string, toggleKey: string, returnType: string) => [];

export const getAndroidCode = (sdkVersion: string, sdkKey: string, toggleKey: string, returnType: string) => [
  {
    name: 'Step 1',
    code: 
`implementation 'com.featureprobe.mobile:android_sdk:${sdkVersion}@aar'
implementation "net.java.dev.jna:jna:5.7.0@aar"
`
  }, 
  {
    name: 'Step 2',
    code: 
`import com.featureprobe.mobile.*;
val url = FpUrlBuilder("remote_url/").build();
val user = FpUser("user@company.com")
user.setAttr("name", "bob")
val config = FpConfig(url!!, "${sdkKey}", 10u, true)
val fp = FeatureProbe(config, user)
`
  }, {
    name: 'Step 3',
    code: 
`${returnType === 'boolean' ? `val value = fp.boolValue("${toggleKey}", false)` : ''}${returnType === 'number' ? `val value = fp.numberValue("${toggleKey}", 1.0)` : ''}${returnType === 'string' ? `val value = fp.stringValue("${toggleKey}", "s")` : ''}${returnType === 'json' ? `val value = fp.jsonValue("${toggleKey}", "{}")` : ''}
`
  }
];

export const getSwiftCode = (sdkKey: string, toggleKey: string, returnType: string) => [
  {
    title: 'Step 1. Install SDK',
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
    title: 'Step 2. Create a FeatureProbe instance:',
    name: '',
    code: 
`import featureprobe
let url = FpUrlBuilder(remoteUrl: "remote_url/").build();
let user = FpUser(key: "user@company.com")
user.setAttr(key: "name", value: "bob")
let config = FpConfig(
    remoteUrl: url!,
    clientSdkKey: "${sdkKey}",
    refreshInterval: 10,
    waitFirstResp: true
)
let fp = FeatureProbe(config: config, user: user)
`
  }, {
    title: 'Step 3. Use the feature toggle',
    name: '',
    code: `${returnType === 'boolean' ? `let value = fp.boolValue("${toggleKey}", false)` : ''}${returnType === 'number' ? `let value = fp.numberValue("${toggleKey}", 1.0)` : ''}${returnType === 'string' ? `let value = fp.stringValue("${toggleKey}", "s")` : ''}${returnType === 'json' ? `let value = fp.jsonValue("${toggleKey}", "{}")` : ''}`
  }
];

export const getObjCCode = (sdkKey: string, toggleKey: string, returnType: string) => [
  {
    title: 'Step 1. Install SDK',
    name: 'Cocoapods:',
    code: 
`
1. add \`pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'\` to Podfile
2. \`pod install\` or \`pod update\`
`
  }, 
  {
    title: 'Step 2. Create a FeatureProbe instance:',
    name: '',
    code: 
`#import "FeatureProbe-Swift.h"

NSString *urlStr = @"remote_url/";
FpUrl *url = [[[FpUrlBuilder alloc] initWithRemoteUrl: urlStr] build];
FpUser *user = [[FpUser alloc] initWithKey:@"user_key"];
[user setAttrWithKey:@"name" value:@"bob"];
FpConfig *config = [[FpConfig alloc] initWithRemoteUrl: url
                                          clientSdkKey:@"${sdkKey}"
                                        refreshInterval: 10
                                          waitFirstResp: true];
FeatureProbe *fp = [[FeatureProbe alloc] initWithConfig:config user:user];`
  }, {
    title: 'Step 3. Use the feature toggle',
    name: '',
    code: `${returnType === 'boolean' ? `bool value = [fp boolValueWithKey: @"${toggleKey}" defaultValue: false];` : ''}${returnType === 'number' ? `double value = [fp numberValueWithKey: @"${toggleKey}" defaultValue: 1.0];` : ''}${returnType === 'string' ? `NSString* value = [fp stringValueWithKey: @"${toggleKey}" defaultValue: @"s"];` : ''}${returnType === 'json' ? `NSString* value = [fp jsonValueWithKey: @"${toggleKey}" defaultValue: @"{}"];` : ''}`
  }
];

export const getJSCode = (sdkKey: string, toggleKey: string, returnType: string) => [
  {
    title: 'Step 1. Install the JavaScript SDK',
    name: 'First, install the FeatureProbe SDK as a dependency in your application.',
    code: 'npm install featureprobe-client-sdk-js --save'
  }, 
  {
    name: 'Or via CDN:',
    code: '<script type="text/javascript" src="https://unpkg.com/featureprobe-client-sdk-js@latest/dist/featureprobe-client-sdk-js.min.js"></script>'
  },
  {
    title: 'Step 2. Create a FeatureProbe instance',
    name: 'After you install and import the SDK, create a single, shared instance of the FeatureProbe sdk.',
    code: 
`const user = new featureProbe.FPUser("user");
user.with("key", "value");

const fp = new featureProbe.FeatureProbe({
    remoteUrl: "https://127.0.0.1:4007",
    clientSdkKey: '${sdkKey}',
    user,
});

fp.start();
`
  }, 
  {
    title: 'Step 3. Use the instance to get your setting value',
    name: 'You can use sdk to check which value this user will receive for a given feature flag.',
    code: 
`fp.on('ready', function() {
    ${returnType === 'boolean' ? `const value = fp.boolValue('${toggleKey}', false);` : ''}${returnType === 'number' ? `const value = fp.numberValue('${toggleKey}', 1.0);` : ''}${returnType === 'string' ? `const value = fp.stringValue('${toggleKey}', "s");` : ''}${returnType === 'json' ? `const value = fp.jsonValue('${toggleKey}', {});` : ''}
})
`
  }
];