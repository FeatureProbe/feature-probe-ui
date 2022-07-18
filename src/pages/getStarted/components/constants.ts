
export const getJavaCode = (sdkVersion: string, sdkKey: string, toggleKey: string) => [
  {
    name: 'step 1. Create a new project（optional）:',
    code: 'mvn archetype:generate -DgroupId=com.featureprobe.demo -DartifactId=featureprobe-java-demo'
  }, {
    name: 'step 2. Add the sdk to your project: ',
    code: `<dependency>
  <groupId>com.featureprobe</groupId>
  <artifactId>server-sdk-java</artifactId>
  <version>${sdkVersion}</version>
</dependency>`
  }, {
    name: 'step 3: Add the following code to your Application',
    code: `public class Demo {
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
        boolean boolValue = fpClient.boolValue("${toggleKey}", user, false);
        if (boolValue) {
            // application code to show the feature
        } else {
            // the code to run if the feature is off
        }
    }
}`
  }
];

export const getRustCode = (sdkVersion: string, sdkKey: string, toggleKey: string) => [
  {
    name: 'step 1: add following in Cargo.toml dependency section',
    code: `feature-probe-server-sdk = "${sdkVersion}"`
  }, {
    name: 'step 2: init sdk instance',
    code: `use feature_probe_server_sdk::{FPConfig, FPUser, FeatureProbe};
let config = FPConfig {
    remote_url: "http://localhost:4007".to_owned(),
    server_sdk_key: "${sdkKey}".to_owned(),
    refresh_interval: Duration::from_secs(1),
    wait_first_resp: true,
};

let fp = match FeatureProbe::new(config).unwrap(); //should check result in production`
  }, {
    name: 'step 3: ',
    code: `let user = FPUser::new("user@company.com").with("name", "bob");
let show_feature = fp.bool_value("${toggleKey}", &user, false);

if show_feature {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}`
  }
];

export const getGoCode = (sdkVersion: string, sdkKey: string, toggleKey: string) => [
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
    code: `
config := featureprobe.FPConfig{
    RemoteUrl:       "https://127.0.0.1:4007",
    ServerSdkKey:    "serverSdkKey",
    RefreshInterval: 1000,
}
  
    fp, err := featureprobe.NewFeatureProbe(config)`
  },
  {
    title: 'Step 3. Use the feature toggle',
    name: 'You can use sdk to check which variation a particular user will receive for a given feature flag.',
    code: `user := featureprobe.NewUser("user")
val := fp.BoolValue("bool_toggle", user, true)`
  }
];

export const getPythonCode = (sdkVersion: string, sdkKey: string, toggleKey: string) => [
];

export const getAndroidCode = (sdkVersion: string, sdkKey: string, toggleKey: string) => [
  {
    name: 'Step 1',
    code: `implementation 'com.featureprobe.mobile:android_sdk:1.0.1@aar'
implementation "net.java.dev.jna:jna:5.7.0@aar"`
  }, 
  {
    name: 'Step 2',
    code: `import com.featureprobe.mobile.*;
val url = FpUrlBuilder("remote_url/").build();
val user = FpUser("user@company.com")
user.setAttr("name", "bob")
val config = FpConfig(url!!, "client-9d885a68ca2955dfb3a7c95435c0c4faad70b50d", 10u, true)
val fp = FeatureProbe(config, user)`
  }, {
    name: 'Step 3',
    code: `  val showFeature = fp.boolValue("your.toggle.key", false)
if (showFeature) {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}`
  }
];

export const getSwiftCode = (sdkVersion: string, sdkKey: string, toggleKey: string) => [
  {
    title: 'Step 1. Install SDK',
    name: 'Swift Package Manager:',
    code: `1. XCode -> File -> Add Packages -> input \`https://github.com/FeatureProbe/client-sdk-ios.git\`
2. click \`Add Package\``
  }, 
  {
    name: 'Cocoapods:',
    code: `1. add \`pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'\` to Podfile
2. \`pod install\` or \`pod update\``
  }, 
  {
    name: 'Step 2. Create a FeatureProbe instance:',
    code: `import featureprobe
let url = FpUrlBuilder(remoteUrl: "remote_url/").build();
let user = FpUser(key: "user@company.com")
user.setAttr(key: "name", value: "bob")
let config = FpConfig(
    remoteUrl: url!,
    clientSdkKey: "client-9d885a68ca2955dfb3a7c95435c0c4faad70b50d",
    refreshInterval: 10,
    waitFirstResp: true
)
let fp = FeatureProbe(config: config, user: user)`
  }, {
    name: 'Step 3. Use the feature toggle',
    code: `let showFeature = fp.boolValue("your.toggle.key", false)
if showFeature {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}`
  }
];

export const getObjCCode = (sdkVersion: string, sdkKey: string, toggleKey: string) => [
  {
    title: 'Step 1. Install SDK',
    name: 'Cocoapods:',
    code: `1. add \`pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'\` to Podfile
2. \`pod install\` or \`pod update\``
  }, 
  {
    name: 'Step 2. Create a FeatureProbe instance:',
    code: `#import "FeatureProbe-Swift.h"

NSString *urlStr = @"remote_url/";
FpUrl *url = [[[FpUrlBuilder alloc] initWithRemoteUrl: urlStr] build];
FpUser *user = [[FpUser alloc] initWithKey:@"user_key"];
[user setAttrWithKey:@"name" value:@"bob"];
FpConfig *config = [[FpConfig alloc] initWithRemoteUrl: url
                                          clientSdkKey:@"client-9d885a68ca2955dfb3a7c95435c0c4faad70b50d"
                                        refreshInterval: 10
                                          waitFirstResp: true];
FeatureProbe *fp = [[FeatureProbe alloc] initWithConfig:config user:user];`
  }, {
    name: 'Step 3. Use the feature toggle',
    code: `bool showFeature = [fp boolValueWithKey: @"your.toggle.key" defaultValue: false];
if (showFeature) {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}`
  }
];

export const getJSCode = (sdkVersion: string, sdkKey: string, toggleKey: string) => [
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
    code: `const user = new featureProbe.FPUser("#USER-KEY#");
user.with("#ATTR-KEY#", "#ATTR-VALUE#");

const fp = new featureProbe.FeatureProbe({
    remoteUrl: "#OPEN-API-URL#",
    clientSdkKey: '#YOUR-CLIENT-SDK-KEY#',
    user,
});
fp.start();`
  }, 
  {
    title: 'Step 3. Use the instance to get your setting value',
    name: 'You can use sdk to check which value this user will receive for a given feature flag.',
    code: `fp.on('ready', function() {
    const result = fp.boolValue('ui_demo_toggle', false);
    if (result) {
        do_some_thing();
    } else {
        do_other_thing();
    }
    const reason = fp.boolDetail('ui_demo_toggle', false);
    console.log(reason);
})`
  }
];