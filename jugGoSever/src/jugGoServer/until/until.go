package until

import "crypto/md5"
import "encoding/hex"

func GetMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s)) //使用zhifeiya名字做散列值，设定后不要变
	return hex.EncodeToString(h.Sum(nil))
}
