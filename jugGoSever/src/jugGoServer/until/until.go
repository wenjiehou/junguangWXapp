package until

import "crypto/md5"
import "encoding/hex"
import "crypto/sha1"

func GetMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s)) //使用zhifeiya名字做散列值，设定后不要变
	return hex.EncodeToString(h.Sum(nil))
}

func GetSha1String(s string) string {
	h := sha1.New()
	h.Write([]byte(s)) //
	return hex.EncodeToString(h.Sum(nil))
}
