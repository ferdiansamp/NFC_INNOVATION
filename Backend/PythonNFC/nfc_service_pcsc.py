import sys, json
from smartcard.System import readers
from smartcard.Exceptions import NoCardException, CardConnectionException

def get_connection():
    r = readers()
    if not r:
        raise Exception("❌ Tidak ada NFC reader terdeteksi")
    conn = r[0].createConnection()
    try:
        conn.connect()
    except NoCardException:
        raise Exception("❌ Tidak ada kartu, tempelkan NFC")
    return conn

def read_uid():
    conn = get_connection()
    GET_UID = [0xFF, 0xCA, 0x00, 0x00, 0x00]  # APDU Get UID
    data, sw1, sw2 = conn.transmit(GET_UID)
    if sw1 == 0x90 or sw1 == 0x62 or sw1 == 0x63:
        uid = "".join(f"{x:02X}" for x in data)
        return {"success": True, "uid": uid}
    return {"success": False, "error": f"Gagal baca UID {sw1:02X}{sw2:02X}"}

def write_file(kode):
    conn = get_connection()

    # Dummy: pakai file ID 1 (contoh, harus disesuaikan ke config kartu EV1 kamu)
    data_bytes = [ord(c) for c in kode]
    if len(data_bytes) > 32:
        data_bytes = data_bytes[:32]

    # Select master app
    conn.transmit([0x90, 0x5A, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00])

    # WriteData (simplified example)
    length = len(data_bytes)
    apdu = [0x90, 0x3D, 0x00, 0x00, 0x07 + length,
            0x01, 0x00, 0x00, 0x00, length, 0x00, 0x00] + data_bytes + [0x00]
    try:
        _, sw1, sw2 = conn.transmit(apdu)
    except CardConnectionException as e:
        return {"success": False, "error": str(e)}

    if sw1 == 0x91 and sw2 == 0x00:
        return {"success": True, "message": "✅ Data berhasil ditulis"}
    else:
        return {"success": False, "error": f"Gagal write {sw1:02X}{sw2:02X}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Butuh argumen read/write"}))
        sys.exit(1)

    mode = sys.argv[1]
    if mode == "read":
        print(json.dumps(read_uid()))
    elif mode == "write":
        if len(sys.argv) < 3:
            print(json.dumps({"success": False, "error": "Butuh kode untuk ditulis"}))
        else:
            print(json.dumps(write_file(sys.argv[2])))
