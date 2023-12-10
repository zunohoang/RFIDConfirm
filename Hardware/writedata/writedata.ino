#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN D3   // Chân kết nối với chân RST của module
#define SS_PIN D8    // Chân kết nối với chân SS/SDA của module

MFRC522 mfrc522(SS_PIN, RST_PIN); // Tạo đối tượng MFRC522

void setup() {
  Serial.begin(9600);   // Khởi tạo giao tiếp Serial
  SPI.begin();          // Khởi tạo giao tiếp SPI
  mfrc522.PCD_Init();    // Khởi tạo module MFRC522
  Serial.println(F("Write data to a MIFARE PICC "));
}

void loop() {
  // Chờ có thẻ được đặt lên
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Đọc UID và loại thẻ
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  Serial.print(F("Card UID:")); // Hiển thị UID
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.print(F(" PICC type: ")); // Hiển thị loại thẻ
  MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
  Serial.println(mfrc522.PICC_GetTypeName(piccType));

  byte buffer[16]; // Mảng để lưu dữ liệu (16 byte)

  // Gán dữ liệu muốn ghi vào mảng buffer
  String dataToWrite = "SV002";
  dataToWrite.getBytes(buffer, 16); // Lấy tối đa 16 byte từ chuỗi

  byte block = 1; // Khối dữ liệu bạn muốn ghi vào
  MFRC522::MIFARE_Key key; // Khóa xác thực (điều này có thể cần điều chỉnh tùy thuộc vào thẻ)
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF; // Khóa mặc định

  // Xác thực với khóa A
  MFRC522::StatusCode status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  // Ghi dữ liệu vào thẻ
  status = mfrc522.MIFARE_Write(block, buffer, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  Serial.println(F("Data written to the card successfully."));

  mfrc522.PICC_HaltA();     // Tạm dừng thẻ
  mfrc522.PCD_StopCrypto1(); // Dừng mã hóa trên PCD
  delay(2000); // Đợi 2 giây trước khi đọc thẻ mới
}
