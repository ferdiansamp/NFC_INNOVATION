import sys, json, subprocess, nfc

def read_tag():
    try:
        out = subprocess.check_output(["nfc-poll"], timeout=5).decode()
        uid = ""
        for line in out.splitlines():
            if "UID" in line or "NFCID1" in line:
                uid = line.split(":")[-1].strip()
                break
        if uid:
            return {"success": True, "uid": uid}
        return {"success": False, "error": "UID tidak ditemukan"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def write_tag(kode):
    try:
        clf = nfc.ContactlessFrontend("usb")
        uid = None

        def on_connect(tag):
            nonlocal uid
            if hasattr(tag, "identifier"):
                uid = tag.identifier.hex().upper()
            if hasattr(tag, "ndef") and tag.ndef:
                tag.ndef.message = nfc.ndef.Message(nfc.ndef.TextRecord(kode))
                return True
            return False

        clf.connect(rdwr={"on-connect": on_connect})
        clf.close()
        return {"success": True, "message": f"Kode {kode} berhasil ditulis", "uid": uid}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "read":
        print(json.dumps(read_tag()))
    elif mode == "write":
        kode = sys.argv[2]
        print(json.dumps(write_tag(kode)))
    elif mode == "loop":
        import time
        while True:
            result = read_tag()
            print(json.dumps(result), flush=True)
            time.sleep(1)
