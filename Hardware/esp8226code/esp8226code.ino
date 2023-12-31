#include <SPI.h>
#include <MFRC522.h>
#include <string.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
 
const char* ssid = "Abc";       // Tên mạng WiFi
const char* password = "1234567899"; // Mật khẩu mạng WiFi
#define RST_PIN         D3         // Configurable, see typical pin layout above
#define SS_PIN          D8        // Configurable, see typical pin layout above
LiquidCrystal_I2C lcd(0x27,16,2);
MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance
const int LED_PIN = 2;
const String URLdiemdanh = "http://192.168.191.88:3000/api/confirm";
const String URLLogin = "http://192.168.191.88:3000/api/login";
String Token = "ABCD";
void setup() {
  lcd.init();                    
  lcd.backlight();
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN,LOW);
	Serial.begin(9600);		// Initialize serial communications with the PC
	SPI.begin();			// Init SPI bus
	mfrc522.PCD_Init();		// Init MFRC522
	mfrc522.PCD_DumpVersionToSerial();	// Show details of PCD - MFRC522 Card Reader details
  WiFi.begin(ssid, password);
  lcd.setCursor(0,0);
  lcd.print("Connecting..");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }           // Hiển thị lên màn hình.
  Serial.println("Kết nối wifi thành công");
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("connected WF");
  digitalWrite(LED_PIN,HIGH);
  delay(500);
  digitalWrite(LED_PIN,LOW);
  delay(500);
  if(login("admin","12345678")==false){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Login FALSE");
     delay(10000000);
  }
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Login TRUE");
  digitalWrite(LED_PIN,HIGH);
  delay(500);
  digitalWrite(LED_PIN,LOW);
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Dat The Len");
}
bool login(String username,String password){
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String apiURL = URLLogin;

    // Sử dụng WiFiClient để chuyển cho HTTPClient
    WiFiClient client;
    
    http.begin(client, apiURL);
    http.addHeader("Content-Type", "application/json");

    // Tạo đối tượng JSON để lưu trữ dữ liệu
    DynamicJsonDocument jsonDocument(200);  // Dung lượng đủ cho dữ liệu của bạn

    // Thêm dữ liệu vào JSON document
    jsonDocument["username"] = username;
    jsonDocument["password"] = password;

    // Chuyển JSON document thành chuỗi JSON
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    int httpResponseCode = http.POST(jsonString);

    bool check;
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("Mã phản hồi HTTP: ");
      Serial.println(httpResponseCode);
      Serial.print("Dữ liệu phản hồi: ");
      Serial.println(response);
      // Chuyển đổi chuỗi JSON thành đối tượng JSON
      DynamicJsonDocument jsonDocument(512);
      deserializeJson(jsonDocument, response);
      // Lấy giá trị từ đối tượng JSON
      check = jsonDocument["code"];
      String x = jsonDocument["token"];
      Token = x;
      Serial.println(x);
    } else {
      Serial.print("Mã lỗi HTTP: ");
      Serial.println(httpResponseCode);
      check = false;
    }

    http.end(); // Đóng kết nối

    return check;
  } else {
    Serial.println("WiFi không kết nối");
    return false;
  }
}
bool DiemDanh(String idCard) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String apiURL = URLdiemdanh;// + "?token=" + Token;
    // Sử dụng WiFiClient để chuyển cho HTTPClient
    WiFiClient client;
    
    http.begin(client, apiURL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer "+ Token);
    // Tạo đối tượng JSON để lưu trữ dữ liệu
    DynamicJsonDocument jsonDocument(200);  // Dung lượng đủ cho dữ liệu của bạn

    // Thêm dữ liệu vào JSON document
    jsonDocument["MaRFID"] = idCard;

    // Chuyển JSON document thành chuỗi JSON
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    int httpResponseCode = http.POST(jsonString);

    bool check;
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("Mã phản hồi HTTP: ");
      Serial.println(httpResponseCode);
      Serial.print("Dữ liệu phản hồi: ");
      Serial.println(response);
      // Chuyển đổi chuỗi JSON thành đối tượng JSON
      DynamicJsonDocument jsonDocument(200);
      deserializeJson(jsonDocument, response);
      // Lấy giá trị từ đối tượng JSON
      check = jsonDocument["code"];
    } else {
      Serial.print("Mã lỗi HTTP: ");
      Serial.println(httpResponseCode);
      check = false;
    }

    http.end(); // Đóng kết nối

    return check;
  } else {
    Serial.println("WiFi không kết nối");
    return false;
  }
}
String s;
void loop() {
   if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    
    // Đọc ID thẻ RFID
    Serial.print("Card UID: ");
    String idCard = "";
    digitalWrite(LED_PIN,LOW);
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      idCard = idCard + String(mfrc522.uid.uidByte[i],HEX);
    }

    // POST data điểm danh
    if(DiemDanh(idCard)){
      Serial.print(idCard + " Điểm danh thành công");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("ID: " + idCard);
      lcd.setCursor(0,1);
      lcd.print("Diem danh OK");
      digitalWrite(LED_PIN,HIGH);
      delay(1000);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Dat the len");
    }else{
      Serial.print(idCard + " Không thành công");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("ID: "+ idCard);
      lcd.setCursor(0,1);
      lcd.print("That Bai");
      delay(1000);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Dat the len");
    }
    Serial.println();

    mfrc522.PICC_HaltA(); // Dừng thẻ RFID hiện tại
  }
}