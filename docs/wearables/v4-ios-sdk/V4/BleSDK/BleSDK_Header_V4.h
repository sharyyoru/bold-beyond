//
//  BleSDK_Header.h
//  BleSDK
//
//  Created by yang sai on 2022/4/27.
//

#ifndef BleSDK_Header_V4_h
#define BleSDK_Header_V4_h


typedef NS_ENUM(NSInteger, DATATYPE_V4) {
    GetDeviceTime_V4 = 0,
    SetDeviceTime_V4 = 1,
    GetPersonalInfo_V4 = 2,
    SetPersonalInfo_V4 = 3,
    GetDeviceInfo_V4 = 4,
    SetDeviceInfo_V4 = 5,
    SetDeviceID_V4 = 6,
    GetDeviceGoal_V4 = 7,
    SetDeviceGoal_V4 = 8,
    GetDeviceBattery_V4 = 9,
    GetDeviceMacAddress_V4 = 10,
    GetDeviceVersion_V4 = 11,
    FactoryReset_V4 = 12,
    MCUReset_V4 = 13,
    MotorVibration_V4 = 14,
    GetDeviceName_V4 = 15,
    SetDeviceName_V4 = 16,
    GetAutomaticMonitoring_V4 = 17,
    SetAutomaticMonitoring_V4 = 18,
    GetAlarmClock_V4 = 19,
    SetAlarmClock_V4 = 20,
    DeleteAllAlarmClock_V4 = 21,
    GetSedentaryReminder_V4 = 22,
    SetSedentaryReminder_V4 = 23,
    RealTimeStep_V4 = 24,
    TotalActivityData_V4 = 25,
    DetailActivityData_V4 = 26,
    DetailSleepData_V4 = 27,
    DynamicHR_V4 = 28,
    StaticHR_V4 = 29,
    ActivityModeData_V4 = 30,
    EnterActivityMode_V4 = 31,
    QuitActivityMode_V4 = 32,
    DeviceSendDataToAPP_V4 = 33,
    EnterTakePhotoMode_V4 = 34,
    StartTakePhoto_V4 = 35,
    StopTakePhoto_V4 = 36,
    BackHomeView_V4 = 37,
    HRVData_V4 = 38,
    GPSData_V4 = 39,
    SetSocialDistanceReminder_V4 = 40,
    GetSocialDistanceReminder_V4 = 41,
    AutomaticSpo2Data_V4 = 42,
    ManualSpo2Data_V4 = 43,
    FindMobilePhone_V4 = 44,
    TemperatureData_V4 = 45,
    AxillaryTemperatureData_V4 = 46,
    SOS_V4  =  47,
    ECG_HistoryData_V4 = 48,
 
    StartECG_V4 = 49,
    StopECG_V4  = 50,
    ECG_RawData_V4 = 51,
    ECG_Success_Result_V4  = 52,
    ECG_Status_V4  = 53,
    ECG_Failed_V4 =  54,
    DeviceMeasurement_HR_V4 =  55,
    DeviceMeasurement_HRV_V4 =  56,
    DeviceMeasurement_Spo2_V4 =  57,
    DeviceMeasurement_Temperature_V4 = 58,
    lockScreen_V4 = 59,
    clickYesWhenUnLockScreen_V4 = 60,
    clickNoWhenUnLockScreen_V4 = 61,
    setWeather_V4  =  62,
    openRRInterval_V4  =  63,
    closeRRInterval_V4  =  64,
    realtimeRRIntervalData_V4  =  65,
    realtimePPIData_V4  =  66,
    realtimePPGData_V4  =  67,
    ppgStartSucessed_V4 = 68,
    ppgStartFailed_V4 = 69,
    ppgResult_V4 = 70,
    ppgStop_V4 = 71,
    ppgQuit_V4 = 72,
    ppgMeasurementProgress_V4 = 73,
    clearAllHistoryData_V4 = 74,
    setMenstruationInfo_V4 = 75,
    setPregnancyInfo_V4 = 76,
    setBloodPressureCalibration_V4 = 77,
    getBloodPressureCalibration_V4 = 78,

    DataError_V4 =  255
};



typedef struct DeviceTime_V4 {
    int year;
    int month;
    int day;
    int hour;
    int minute;
    int second;
} MyDeviceTime_V4;

typedef struct PersonalInfo_V4 {
    int gender;
    int age;
    int height;
    int weight;
    int stride;
} MyPersonalInfo_V4;

typedef struct NotificationType_V4 {
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
} MyNotificationType_V4;

typedef struct DeviceInfo_V4 {
    int ANCS;
    MyNotificationType_V4 notificationType;
    int baseHeartRate;
} MyDeviceInfo_V4;




typedef struct Weeks_V4 {
    BOOL sunday;
    BOOL monday;
    BOOL Tuesday;
    BOOL Wednesday;
    BOOL Thursday;
    BOOL Friday;
    BOOL Saturday;
} MyWeeks_V4;


/**
 AutomaticMonitoring
 mode:工作模式，0：关闭  1:时间段工作方式，2： 时间段内间隔工作方式
 startTime_Hour: 开始时间的小时
 startTime_Minutes: 开始时间的分钟
 endTime_Hour:
*/

typedef struct AutomaticMonitoring_V4 {
    int mode;
    int startTime_Hour;
    int startTime_Minutes;
    int endTime_Hour;
    int endTime_Minutes;
    MyWeeks_V4 weeks;
    int intervalTime;
    int dataType;// 1 means heartRate  2 means spo2  3 means temperature  4 means HRV
} MyAutomaticMonitoring_V4;

typedef struct SedentaryReminder_V4 {
    int startTime_Hour;
    int startTime_Minutes;
    int endTime_Hour;
    int endTime_Minutes;
    MyWeeks_V4 weeks;
    int intervalTime;
    int leastSteps;
    int mode;
} MySedentaryReminder_V4;

typedef struct AlarmClock_V4 {
    int openOrClose;
    int clockType;
    int endTime_Hour;
    int endTime_Minutes;
    int weeks;
    int intervalTime;
    int leastSteps;
    int mode;
} MyAlarmClock_V4;

typedef struct BPCalibrationParameter_V4 {
    int gender;
    int age;
    int height;
    int weight;
    int BP_high;
    int BP_low;
    int heartRate;
} MyBPCalibrationParameter_V4;


typedef struct WeatherParameter_V4 {
    int weatherType;
    int currentTemperature;
    int highestTemperature;
    int lowestTemperature;
    NSString * strCity;
} MyWeatherParameter_V4;

typedef struct BreathParameter_V4 {
    int breathMode;
    int DurationOfBreathingExercise;
} MyBreathParameter_V4;

typedef struct SocialDistanceReminder_V4 {
    char scanInterval;
    char scanTime;
    char signalStrength;
} MySocialDistanceReminder_V4;


typedef NS_ENUM(NSInteger, ACTIVITYMODE_V4) {
    Run_V4 = 0,
    Cycling_V4    = 1,
    Badminton_V4 = 2,
    Football_V4    = 3,
    Tennis_V4 = 4,
    Yoga_V4    = 5,
    Breath_V4 = 6,
    Dance_V4    = 7,
    Basketball_V4 = 8,
    Walk_V4    = 9,
    Workout_V4    = 10,
    Cricket_V4    = 11,
    Hiking_V4    = 12,
    Aerobics_V4    = 13,
    PingPong_V4    = 14,
    RopeJump_V4    = 15,
    SitUps_V4    = 16,
    Volleyball_V4    = 17
};

#endif /* BleSDK_Header_V4_h */
