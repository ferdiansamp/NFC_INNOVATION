import sys, json, time
from smartcard.System import readers
from smartcard.Exceptions import NoCardException

def get_connection():
    r = readers()
    if not r:
        raise Exception("Tidak ada reader")

    conn = r[0].createConnection()
    while True:
        try:
            conn.connect()
            return conn
        except NoCardException:
            print("⚠️ Tempelkan kartu di reader...")
            time.sleep(0.5)

def read_uid():
    conn = get_connection()
    apdu = [0xFF, 0xCA, 0x00, 0x00, 0x00]  # get UID
    data, sw1, sw2 = conn.transmit(apdu)
    uid = "".join(["%02X" % x for x in data])
    return {"success": True, "uid": uid}

def write_data(kode):
    conn = get_connection()
    # contoh: tulis ke blok 4 (MIFARE) — EV1 bisa ke file lain pakai APDU lebih advance
    apdu = [0xFF, 0xD6, 0x00, 0x04, len(kode)] + [ord(c) for c in kode]
    data, sw1, sw2 = conn.transmit(apdu)
    if sw1 == 0x90 and sw2 == 0x00:
        return {"success": True, "message": f"Kode {kode} berhasil ditulis"}
    else:
        return {"success": False, "error": f"Gagal tulis: SW1={sw1:02X}, SW2={sw2:02X}"}

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "read":
        print(json.dumps(read_uid()))
    elif mode == "write":
        kode = sys.argv[2]
        print(json.dumps(write_data(kode)))
