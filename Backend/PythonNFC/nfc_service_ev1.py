import sys, json, nfc
import ev1_helper as ev1

def read_uid():
    try:
        clf = nfc.ContactlessFrontend('usb:072f:2200')
        tag = clf.connect(rdwr={'on-connect': lambda tag: True})
        if tag:
            uid = tag.identifier.hex()
            clf.close()
            return {"success": True, "uid": uid}
        else:
            clf.close()
            return {"success": False, "error": "Tidak ada tag"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def ev1_write(kode):
    """Write kode ke FileID 01 (harus sudah ada Application dan File)"""
    try:
        clf = nfc.ContactlessFrontend('usb:072f:2200')
        def on_connect(tag):
            if not isinstance(tag, nfc.tag.tt4.Type4Tag):
                return {"success": False, "error": "Bukan DESFire EV1"}

            # Select Master
            resp = tag.send_apdu(ev1.apdu_select_application([0x00,0x00,0x00]))
            print("Select Master:", resp.hex())

            # Select AID (misal 11 22 33)
            resp = tag.send_apdu(ev1.apdu_select_application([0x11,0x22,0x33]))
            print("Select AID 112233:", resp.hex())

            # Write Data
            resp = tag.send_apdu(ev1.apdu_write_data(0x01, kode.encode()))
            print("Write Data:", resp.hex())

            return {"success": True, "message": f"Tiket {kode} berhasil ditulis"}

        result = clf.connect(rdwr={'on-connect': on_connect})
        clf.close()
        return result if result else {"success": False, "error": "Tag tidak terbaca"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def ev1_read(length=32):
    """Read data dari FileID 01"""
    try:
        clf = nfc.ContactlessFrontend('usb:072f:2200')
        def on_connect(tag):
            if not isinstance(tag, nfc.tag.tt4.Type4Tag):
                return {"success": False, "error": "Bukan DESFire EV1"}

            resp = tag.send_apdu(ev1.apdu_select_application([0x11,0x22,0x33]))
            print("Select AID 112233:", resp.hex())

            resp = tag.send_apdu(ev1.apdu_read_data(0x01, length))
            print("Read Data:", resp.hex())

            try:
                data = resp[:-2].decode(errors="ignore")
            except:
                data = resp[:-2].hex()

            return {"success": True, "data": data}

        result = clf.connect(rdwr={'on-connect': on_connect})
        clf.close()
        return result if result else {"success": False, "error": "Tag tidak terbaca"}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"success": False, "error": "Mode tidak diberikan"}))
            sys.exit(0)

        mode = sys.argv[1]
        if mode == "read":
            result = read_uid()
        elif mode == "ev1_read":
            result = ev1_read()
        elif mode == "ev1_write":
            if len(sys.argv) < 3:
                result = {"success": False, "error": "kodeTiket tidak diberikan"}
            else:
                result = ev1_write(sys.argv[2])
        else:
            result = {"success": False, "error": f"Mode tidak dikenali: {mode}"}

        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Fatal: {str(e)}"}))
        sys.exit(1)
