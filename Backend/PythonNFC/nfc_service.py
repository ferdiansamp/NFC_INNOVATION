import sys, json
import nfc
from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.Exceptions import NoCardException

# --- READ UID pakai nfcpy ---
def read_uid():
    try:
        clf = nfc.ContactlessFrontend("usb")
        tag = clf.connect(rdwr={"on-connect": lambda tag: False})
        uid = tag.identifier.hex()
        clf.close()
        return {"success": True, "uid": uid}
    except Exception as e:
        return {"success": False, "error": str(e)}

# --- WRITE pakai pyscard (ACR122U EV1) ---
def write_text(kode):
    try:
        r = readers()
        if not r:
            return {"success": False, "error": "No NFC reader detected"}
        reader = r[0]
        conn = reader.createConnection()
        conn.connect()

        # APDU select NDEF application
        SELECT_NDEF = [0x00, 0xA4, 0x04, 0x00, 0x07,
                       0xD2, 0x76, 0x00, 0x00, 0x85, 0x01, 0x01, 0x00]
        data, sw1, sw2 = conn.transmit(SELECT_NDEF)
        if sw1 != 0x90:
            return {"success": False, "error": f"Failed select NDEF: SW1={sw1:02X} SW2={sw2:02X}"}

        # Simple write (contoh: simpan text sebagai record, minimal demo)
        text_bytes = kode.encode("utf-8")
        payload = [0x54, 0x02, 0x65, 0x6E] + list(text_bytes)  # "T" record EN language
        # Normally harus buat NDEF TLV, disederhanakan
        WRITE_CMD = [0x00, 0xD6, 0x00, 0x00, len(payload)] + payload
        data, sw1, sw2 = conn.transmit(WRITE_CMD)

        if sw1 == 0x90:
            return {"success": True, "message": f"Tiket {kode} berhasil ditulis"}
        else:
            return {"success": False, "error": f"Write failed: SW1={sw1:02X} SW2={sw2:02X}"}
    except NoCardException:
        return {"success": False, "error": "No NFC card detected"}
    except Exception as e:
        return {"success": False, "error": str(e)}

# --- CLI Mode ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Mode tidak diberikan"}))
        sys.exit(1)

    mode = sys.argv[1]
    if mode == "read":
        print(json.dumps(read_uid()))
    elif mode == "write":
        if len(sys.argv) < 3:
            print(json.dumps({"success": False, "error": "Kode tiket tidak diberikan"}))
        else:
            print(json.dumps(write_text(sys.argv[2])))
