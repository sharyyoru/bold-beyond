//
//  BleSDK_Header.h
//  BleSDK
//
//  Created by yang sai on 2022/4/27.
//

#ifndef BleSDK_Header_V5_h
#define BleSDK_Header_V5_h


typedef NS_ENUM(NSInteger, DATATYPE_V5) {
    GetDeviceTime_V5 = 0,
    SetDeviceTime_V5 = 1,
    GetPersonalInfo_V5 = 2,
    SetPersonalInfo_V5 = 3,
    GetDeviceInfo_V5 = 4,
    SetDeviceInfo_V5 = 5,
    SetDeviceID_V5 = 6,
    GetDeviceGoal_V5 = 7,
    SetDeviceGoal_V5 = 8,
    GetDeviceBattery_V5 = 9,
    GetDeviceMacAddress_V5 = 10,
    GetDeviceVersion_V5 = 11,
    FactoryReset_V5 = 12,
    MCUReset_V5 = 13,
    MotorVibration_V5 = 14,
    GetDeviceName_V5 = 15,
    SetDeviceName_V5 = 16,
    GetAutomaticMonitoring_V5 = 17,
    SetAutomaticMonitoring_V5 = 18,
    GetAlarmClock_V5 = 19,
    SetAlarmClock_V5 = 20,
    DeleteAllAlarmClock_V5 = 21,
    GetSedentaryReminder_V5 = 22,
    SetSedentaryReminder_V5 = 23,
    RealTimeStep_V5 = 24,
    TotalActivityData_V5 = 25,
    DetailActivityData_V5 = 26,
    DetailSleepData_V5 = 27,
    DynamicHR_V5 = 28,
    StaticHR_V5 = 29,
    ActivityModeData_V5 = 30,
    StartActivityMode_V5 = 31,
    StopActivityMode_V5 = 32,
    PauseActivityMode_V5 = 33,
    ContinueActivityMode_V5 = 34,
    GetActivityMode_V5 = 35,
    DeviceSendDataToAPP_V5 = 36,
    EnterTakePhotoMode_V5 = 37,
    StartTakePhoto_V5 = 38,
    StopTakePhoto_V5 = 39,
    BackHomeView_V5 = 40,
    HRVData_V5 = 41,
    GPSData_V5 = 42,
    SetSocialDistanceReminder_V5 = 43,
    GetSocialDistanceReminder_V5 = 44,
    AutomaticSpo2Data_V5 = 45,
    ManualSpo2Data_V5 = 46,
    FindMobilePhone_V5 = 47,
    TemperatureData_V5 = 48,
    AxillaryTemperatureData_V5 = 49,
    SOS_V5  =  50,
    ECG_HistoryData_V5 = 51,
 
    StartECG_V5 = 52,
    StopECG_V5  = 53,
    ECG_RawData_V5 = 54,
    ECG_Success_Result_V5  = 55,
    ECG_Status_V5  = 56,
    ECG_Failed_V5 =  57,
    DeviceMeasurement_HR_V5 =  58,
    DeviceMeasurement_HRV_V5 =  59,
    DeviceMeasurement_Spo2_V5 =  60,
    unLockScreen_V5 = 61,
    lockScreen_V5 = 62,
    clickYesWhenUnLockScreen_V5 = 63,
    clickNoWhenUnLockScreen_V5 = 64,
    setWeather_V5  =  65,
    openRRInterval_V5  =  66,
    closeRRInterval_V5  =  67,
    realtimeRRIntervalData_V5  =  68,
    realtimePPIData_V5  =  69,
    realtimePPGData_V5  =  70,
    ppgStartSucessed_V5 = 71,
    ppgStartFailed_V5 = 72,
    ppgResult_V5 = 73,
    ppgStop_V5 = 74,
    ppgQuit_V5 = 75,
    ppgMeasurementProgress_V5 = 76,
    clearAllHistoryData_V5 = 77,
    setMenstruationInfo_V5 = 78,
    setPregnancyInfo_V5 = 79,
    DeviceMeasurement_V5 =  80,
    DetailSleepAndActivityData_V5 =  81,
    ppiData_V5 = 82,
    
    
    DataError_V5 =  255
};



typedef struct DeviceTime_V5 {
    int year;
    int month;
    int day;
    int hour;
    int minute;
    int second;
} MyDeviceTime_V5;

typedef struct PersonalInfo_V5 {
    int gender;
    int age;
    int height;
    int weight;
    int stride;
} MyPersonalInfo_V5;

typedef struct NotificationType_V5 {
    int call;
    int SMS;
    int wechat;
    int facebook;
    int instagram;
    int skype;
    int telegram;
    int twitter;
    int vkclient;
    int whatsapp;
    int qq;
    int In;
} MyNotificationType_V5;

typedef struct DeviceInfo_V5 {
    int distanceUnit;
    int timeUnit;
    int wristOn;
    int temperatureUnit;
    int notDisturbMode;
    int ANCS;
    MyNotificationType_V5 notificationType;
    int baseHeartRate;
    int screenBrightness;
    int watchFaceStyle;
    int socialDistanceRemind;
    int language;
} MyDeviceInfo_V5;




typedef struct Weeks_V5 {
    BOOL sunday;
    BOOL monday;
    BOOL Tuesday;
    BOOL Wednesday;
    BOOL Thursday;
    BOOL Friday;
    BOOL Saturday;
} MyWeeks_V5;


/**
 AutomaticMonitoring
 mode:工作模式，0：关闭  1:时间段工作方式，2： 时间段内间隔工作方式
 startTime_Hour: 开始时间的小时
 startTime_Minutes: 开始时间的分钟
 endTime_Hour:
*/

typedef struct AutomaticMonitoring_V5 {
    int mode;
    int startTime_Hour;
    int startTime_Minutes;
    int endTime_Hour;
    int endTime_Minutes;
    MyWeeks_V5 weeks;
    int intervalTime;
    int dataType;// 1 means heartRate  2 means spo2  3 means temperature  4 means HRV
} MyAutomaticMonitoring_V5;




typedef struct BPCalibrationParameter_V5 {
    int gender;
    int age;
    int height;
    int weight;
    int BP_high;
    int BP_low;
    int heartRate;
} MyBPCalibrationParameter_V5;


typedef struct WeatherParameter_V5 {
    int weatherType;
    int currentTemperature;
    int highestTemperature;
    int lowestTemperature;
    NSString * strCity;
} MyWeatherParameter_V5;

typedef struct BreathParameter_V5 {
    int breathMode; //  0  1  2 three mode 
    int DurationOfBreathingExercise;
} MyBreathParameter_V5;

typedef struct SocialDistanceReminder_V5 {
    char scanInterval;
    char scanTime;
    char signalStrength;
} MySocialDistanceReminder_V5;


typedef NS_ENUM(NSInteger, MeasurementDataType_V5) {
    heartRateData_V5    = 2,
    spo2Data_V5 = 3
  
};

typedef NS_ENUM(NSInteger, ACTIVITYMODE_V5) {
    Run = 0,
    Cycling    = 1,
    Badminton = 2,
    Football    = 3,
    Tennis = 4,
    Yoga    = 5,
    Breath = 6,
    Dance    = 7,
    Basketball = 8,
    Walk    = 9,
    Workout    = 10,
    Cricket    = 11,
    Hiking    = 12,
    Aerobics    = 13,
    PingPong    = 14,
    RopeJump    = 15,
    SitUps    = 16,
    Volleyball    = 17
};

typedef NS_ENUM(NSInteger, WORKMODE_V5) {
    startActivity = 1,
    pauseActivity    = 2,
    continueActivity = 3,
    stopActivity    = 4
};


#endif /* BleSDK_Header_V5_h */
