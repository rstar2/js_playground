/* globals window */


/*

// generate a RSA Private Key in PKCS-1 format - (e.g '-----BEGIN RSA PRIVATE KEY-----')
$ openssl genrsa -out privkey.pem 2048

// generate a RSA Public Key (e.g '-----BEGIN PUBLIC KEY-----')
$ openssl rsa -pubout -in privkey.pem -out pubkey.pem

// convert the RSA Private Key in PKCS-1 to PKCS-8 
$ openssl pkey -in privkey.pem -out privkey_pkcs8.pem (e.g '-----BEGIN PRIVATE KEY-----')

// I.
// encrypt message - the output message.enc file will be binary
$  echo "Hello" | openssl rsautl -encrypt -pubin -inkey pubkey.pem -out message.enc
// decrypt message
$ cat message.enc | openssl rsautl -decrypt -inkey privkey.pem
// should ouytput "Hello"

//II.
// encrypt messsage and encoded with base64
$ echo "Hello" | openssl rsautl -encrypt -pubin -inkey pubkey.pem | base64 > message.enc.b64
// decrypt a base64 encoded message
$ base64 -d message.enc.b64 | openssl rsautl -decrypt -inkey privkey.pem
// should ouytput "Hello"

// NOTE! if using the WebCryptoAPI for encrypting it support only RSA-OAEP format
// so the decrypting should be with the flag -oaep
$ base64 -d message.enc.b64 | openssl rsautl -decrypt -inkey privkey.pem -oaep

*/




// // privkey.pem
// const privateKeyPEM = `-----BEGIN RSA PRIVATE KEY-----
// MIIJJwIBAAKCAgEAs9HIRotqq7Qm9IYpZIe1fK35Z2kaMKohzevcf62mVc0gs7Tj
// SLYIPINFK7r1xA9Rshd/IAKm0rcMDDgFLdNio9x0Y/F3HWCZ2Xdbcj6UdX0ls2cj
// eQjRuJyXEUUMw712zFKwwbCXyrXcz8jgGw5oGmGIowHI2MN9LWw5vHZHiptSxLIb
// 9rIId+W2lpAL1gu+8/IQFS1Q8saRTBpB9SF4DBAaIYbG01VN+55TFEhRxe4BwiEY
// AsGU8JMrlklBMA27+HlJgP6MOo/7JJpQxULM0tq2bh2dLAIrtCIAQyAG8GQLPXQE
// JdMn4YOe7xnq/ccAa/UdRR0lmH/8V1ZL/9mZ2nbhueg9ytPsDQnG8OMkc2LRyDP+
// GKBsYd/QgxhWdScDN56g6n4R5JHHdP1oTiR3/RvNnOciqVL0khEPtQXPcl1Zt5/n
// zH9h2T4+yiksqOa2MXuN2rL+9YVrGCO1Rk7x7WDOOsRG8p33LbD/hOjTcXqCWb5c
// /6rZISqLRJoaddXivKR86vyGFVPJe5fHW5jVZj2JQQIkFAaJRxn1MKHNW6U8fP+E
// SJmR/CGxZZZRnqHa76pxm44xiX7Oe+mUCMl4VNjio6PUXdM4IkTU55HeOAd2btX8
// ROV1G0E7Cj8Y+lLilqtZRCllnk2qiVdPpAX8e7H3XgGx2OOxAqtvbyFqB/ECAwEA
// AQKCAf9CupaXlyT+ktvh4ed6ZuHyYp0qwtX1OS1SPTSWLNqM/JImHfo6AVMNIamJ
// kNei6gxnClEij9lYWJUf86n4V3lDVYvbir+pJy/wg1psCs0MzGQxLxT61Ur+Nx3Y
// Ssdx29059XWiauXpU5Odh+2iHLaFE6yg0Qi3Z9QMBx1l0n658OnGFFJMOcTquVQI
// i2vZAoLaA/nz4d0oOoewtg3D6aei0lbgGiOuSPmnZhlubWfrC2eboqxGWY/rtrF2
// E7kdG/ulOV0NgWiIUuXfr2RJz4Ayvvbz5gltS2Dsd7GhN0Fb88Q4CdWAM9uY1D8m
// e3e4tSBy74LtIuPQs63wuxV43Ec7K5qlf/wbAiCyEZuKUQ/uld3qDhbpZZ3QE0O/
// kwRhLVr0lthJY5Uxu1r0Br34U9UqZADj2iQZD1cpxBwScnbjePRnJTefdpby23Nx
// 6nkdCNEahJNd5vke+BvLavQVjB+3G88OCwpxIrFOQUm8KKYa2t/dqIWx4+8A8hwg
// DiVToTUDewdTLPcrqAT2TBgHIZjZgKzEGb+kvU0tg3fYwtcoiIrprVOBu1G1oRFp
// H/dHY7LOzxaloA5QFeLKfdzaJBpT24j6A1ut9iMzXaxpHnBWfsGGu8MUJmtBzDX+
// Pgy1Y4mIPGZ5bqecJjtv0enWw/I1T/2DoZ1zcjnujy0Q7VCNAoIBAQDbfJoHr64p
// JAX1G+f0KzA4wHGtcDTa4DHnNtgxgNCMm04vMHtcAPAStvNLNQwdJnHD7+pEDnls
// qy1z0rdT+m8KP6vbb215Edjol/aaIHW8R5/LtK+jx86BQoKRzsgAdfwstHT6GJaA
// 2wS39TUX53m/H4I1Gdq5Cso3U/Ctyd6853EkW26GHlXrr4UeWBUG39FuovCqDUdq
// ov0fuZfyOfl7NYEQMbliJaMB9IES3Xkg3Y87ZLLqqxZ2YWmdeN0dmwkrgTXQO2Y5
// 4PNq6icJVwHJVjrTZp0EbZs0Au8a4rNQrJWlS0ho0uGEuYzx+wfgMSqG6aukeQJg
// BzwveCuizrVjAoIBAQDRu9mIn1f4TN4hUyl5efCTtF7R/yiGJTji1W1bVx1XwHsZ
// vup19G+bOca7GwPcvAFPU4KFWmKO37J5eLYhkL1ueLKSSy9hXF1yN4ceFuZYbjJ4
// H4rIPHq1ZIFJ0kcP8c2LnV/J7GEHMIduAkEjbJrA1MXundBLu8MQjV5B0OiLar2F
// aBLRPmTN/VlTjryIMOrFZu/wTWIy8/xUHPvF+gAlcZI/hUObmPhArJ3uOngVQuh/
// f43KDVpmNNCbL81YcvAptWmnlGfqrPpLb2V4w/W/OGXkKl9bpWSFOKtvjKQklIhf
// KbYj7j6pB6i37G8z2NyZALCwaR8bcCrEbtdtaYebAoIBAHyxHRCgzeCxhnDpma0t
// nAehzPMre9uc4rzoe4okFFbNJG3KrUpnffwj07Q2PtuQq7EU65IeZv1Fglz6qQwc
// iljYM1pGw3q0mPYK3x5QspJ0XmPsEpyJNthYYLVVNGqOnOUI4Cv1LAuoYdXgiHk8
// F/5seBySw5+8cYVdOq6AsPnAwpZVG0U2lrl+zbGfeNKe9OxVxUPWp2v9jLApUBlc
// tk845km89gS8PQ8vSOTezaHOPUEQxFRtPiWi0c2UjIn1OhBtJ5VVKY5YLfHfdK3p
// sCohwum2sh2B51p1EEHF6Pk8EwgE7O4gX953S4ttgdvsEqzys4CM/rxvX9HYA3JK
// 3OECggEBAL9ugE1Nc5P1RUKRj2eLP2Tx2yI9jRVz4Apa1+fpCaVQ0ItdUM+8/ilm
// gNfC/rF5AJERHi7tosvZriNlZIgafmzYydTxvxtUnQ5lVHTIXhMU8gfmclv1p+Lt
// C3z/61DIWd43FHlPwfg3+UUV1bKprE6ZZtg3PyoBBTiUcBYOwlKOaNHdfl9yXbwO
// pHu56qc8Tu1C2Xoyh5EOVZ/InJ3FZGDI2r4TuvPImb8eT0BkKbruSRwmpppnub1U
// M5uR9BHpRwAqz3bf5EG1BPfZg3rJEgMpTQcHDeaufaODaCb27dNdp2OExPTivlq1
// 3O+TZKSkKiWVFbDPIk9+/+ovaX46NkUCggEAej1IIIeHUEMKGJWiZ+YTIUOWh6wo
// rrTkNq4pz3wmyTG9RFIwCa2UO8Yjhrxw+Wo6bo8JXpR8mLEBwG6X9fPMLsL7A760
// FmBqwtA+3zIyj4e7T7Y8ZMqdetYsen61M4dvveNaprfXV0Nq94j0BODu4XVzYYpH
// o1am80tGf1kzjskA6WdIiM9GM/fsj245+IamY89YJ5HWql0cZucfTyuAZfRCZ5S8
// nlAFhoy7wLEyo4WKUBOdPbcz7lsZFGAcQYcktZAqXPgcZVp4tuxd6HeCzTbEtBJj
// VDSM5/7YSPfT5iJqtLDSNUtAPqW9ju3dG+0itdiaAs2nrl8W7QGoaVdd6g==
// -----END RSA PRIVATE KEY-----
// `;

// // privkey_pkcs8.pem
// const privateKeyPEM_PKCS8 = `-----BEGIN PRIVATE KEY-----
// MIIJQQIBADANBgkqhkiG9w0BAQEFAASCCSswggknAgEAAoICAQCz0chGi2qrtCb0
// hilkh7V8rflnaRowqiHN69x/raZVzSCztONItgg8g0UruvXED1GyF38gAqbStwwM
// OAUt02Kj3HRj8XcdYJnZd1tyPpR1fSWzZyN5CNG4nJcRRQzDvXbMUrDBsJfKtdzP
// yOAbDmgaYYijAcjYw30tbDm8dkeKm1LEshv2sgh35baWkAvWC77z8hAVLVDyxpFM
// GkH1IXgMEBohhsbTVU37nlMUSFHF7gHCIRgCwZTwkyuWSUEwDbv4eUmA/ow6j/sk
// mlDFQszS2rZuHZ0sAiu0IgBDIAbwZAs9dAQl0yfhg57vGer9xwBr9R1FHSWYf/xX
// Vkv/2ZnaduG56D3K0+wNCcbw4yRzYtHIM/4YoGxh39CDGFZ1JwM3nqDqfhHkkcd0
// /WhOJHf9G82c5yKpUvSSEQ+1Bc9yXVm3n+fMf2HZPj7KKSyo5rYxe43asv71hWsY
// I7VGTvHtYM46xEbynfctsP+E6NNxeoJZvlz/qtkhKotEmhp11eK8pHzq/IYVU8l7
// l8dbmNVmPYlBAiQUBolHGfUwoc1bpTx8/4RImZH8IbFlllGeodrvqnGbjjGJfs57
// 6ZQIyXhU2OKjo9Rd0zgiRNTnkd44B3Zu1fxE5XUbQTsKPxj6UuKWq1lEKWWeTaqJ
// V0+kBfx7sfdeAbHY47ECq29vIWoH8QIDAQABAoIB/0K6lpeXJP6S2+Hh53pm4fJi
// nSrC1fU5LVI9NJYs2oz8kiYd+joBUw0hqYmQ16LqDGcKUSKP2VhYlR/zqfhXeUNV
// i9uKv6knL/CDWmwKzQzMZDEvFPrVSv43HdhKx3Hb3Tn1daJq5elTk52H7aIctoUT
// rKDRCLdn1AwHHWXSfrnw6cYUUkw5xOq5VAiLa9kCgtoD+fPh3Sg6h7C2DcPpp6LS
// VuAaI65I+admGW5tZ+sLZ5uirEZZj+u2sXYTuR0b+6U5XQ2BaIhS5d+vZEnPgDK+
// 9vPmCW1LYOx3saE3QVvzxDgJ1YAz25jUPyZ7d7i1IHLvgu0i49CzrfC7FXjcRzsr
// mqV//BsCILIRm4pRD+6V3eoOFullndATQ7+TBGEtWvSW2EljlTG7WvQGvfhT1Spk
// AOPaJBkPVynEHBJyduN49GclN592lvLbc3HqeR0I0RqEk13m+R74G8tq9BWMH7cb
// zw4LCnEisU5BSbwophra392ohbHj7wDyHCAOJVOhNQN7B1Ms9yuoBPZMGAchmNmA
// rMQZv6S9TS2Dd9jC1yiIiumtU4G7UbWhEWkf90djss7PFqWgDlAV4sp93NokGlPb
// iPoDW632IzNdrGkecFZ+wYa7wxQma0HMNf4+DLVjiYg8Znlup5wmO2/R6dbD8jVP
// /YOhnXNyOe6PLRDtUI0CggEBANt8mgevrikkBfUb5/QrMDjAca1wNNrgMec22DGA
// 0IybTi8we1wA8BK280s1DB0mccPv6kQOeWyrLXPSt1P6bwo/q9tvbXkR2OiX9pog
// dbxHn8u0r6PHzoFCgpHOyAB1/Cy0dPoYloDbBLf1NRfneb8fgjUZ2rkKyjdT8K3J
// 3rzncSRbboYeVeuvhR5YFQbf0W6i8KoNR2qi/R+5l/I5+Xs1gRAxuWIlowH0gRLd
// eSDdjztksuqrFnZhaZ143R2bCSuBNdA7Zjng82rqJwlXAclWOtNmnQRtmzQC7xri
// s1CslaVLSGjS4YS5jPH7B+AxKobpq6R5AmAHPC94K6LOtWMCggEBANG72YifV/hM
// 3iFTKXl58JO0XtH/KIYlOOLVbVtXHVfAexm+6nX0b5s5xrsbA9y8AU9TgoVaYo7f
// snl4tiGQvW54spJLL2FcXXI3hx4W5lhuMngfisg8erVkgUnSRw/xzYudX8nsYQcw
// h24CQSNsmsDUxe6d0Eu7wxCNXkHQ6ItqvYVoEtE+ZM39WVOOvIgw6sVm7/BNYjLz
// /FQc+8X6ACVxkj+FQ5uY+ECsne46eBVC6H9/jcoNWmY00JsvzVhy8Cm1aaeUZ+qs
// +ktvZXjD9b84ZeQqX1ulZIU4q2+MpCSUiF8ptiPuPqkHqLfsbzPY3JkAsLBpHxtw
// KsRu121ph5sCggEAfLEdEKDN4LGGcOmZrS2cB6HM8yt725zivOh7iiQUVs0kbcqt
// Smd9/CPTtDY+25CrsRTrkh5m/UWCXPqpDByKWNgzWkbDerSY9grfHlCyknReY+wS
// nIk22FhgtVU0ao6c5QjgK/UsC6hh1eCIeTwX/mx4HJLDn7xxhV06roCw+cDCllUb
// RTaWuX7NsZ940p707FXFQ9ana/2MsClQGVy2TzjmSbz2BLw9Dy9I5N7Noc49QRDE
// VG0+JaLRzZSMifU6EG0nlVUpjlgt8d90remwKiHC6bayHYHnWnUQQcXo+TwTCATs
// 7iBf3ndLi22B2+wSrPKzgIz+vG9f0dgDckrc4QKCAQEAv26ATU1zk/VFQpGPZ4s/
// ZPHbIj2NFXPgClrX5+kJpVDQi11Qz7z+KWaA18L+sXkAkREeLu2iy9muI2VkiBp+
// bNjJ1PG/G1SdDmVUdMheExTyB+ZyW/Wn4u0LfP/rUMhZ3jcUeU/B+Df5RRXVsqms
// Tplm2Dc/KgEFOJRwFg7CUo5o0d1+X3JdvA6ke7nqpzxO7ULZejKHkQ5Vn8icncVk
// YMjavhO688iZvx5PQGQpuu5JHCammme5vVQzm5H0EelHACrPdt/kQbUE99mDeskS
// AylNBwcN5q59o4NoJvbt012nY4TE9OK+WrXc75NkpKQqJZUVsM8iT37/6i9pfjo2
// RQKCAQB6PUggh4dQQwoYlaJn5hMhQ5aHrCiutOQ2rinPfCbJMb1EUjAJrZQ7xiOG
// vHD5ajpujwlelHyYsQHAbpf188wuwvsDvrQWYGrC0D7fMjKPh7tPtjxkyp161ix6
// frUzh2+941qmt9dXQ2r3iPQE4O7hdXNhikejVqbzS0Z/WTOOyQDpZ0iIz0Yz9+yP
// bjn4hqZjz1gnkdaqXRxm5x9PK4Bl9EJnlLyeUAWGjLvAsTKjhYpQE509tzPuWxkU
// YBxBhyS1kCpc+BxlWni27F3od4LNNsS0EmNUNIzn/thI99PmImq0sNI1S0A+pb2O
// 7d0b7SK12JoCzaeuXxbtAahpV13q
// -----END PRIVATE KEY-----
// `;
// // pubkey.pem
// const publicKeyPEM_PKCS8 = `-----BEGIN PUBLIC KEY-----
// MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAs9HIRotqq7Qm9IYpZIe1
// fK35Z2kaMKohzevcf62mVc0gs7TjSLYIPINFK7r1xA9Rshd/IAKm0rcMDDgFLdNi
// o9x0Y/F3HWCZ2Xdbcj6UdX0ls2cjeQjRuJyXEUUMw712zFKwwbCXyrXcz8jgGw5o
// GmGIowHI2MN9LWw5vHZHiptSxLIb9rIId+W2lpAL1gu+8/IQFS1Q8saRTBpB9SF4
// DBAaIYbG01VN+55TFEhRxe4BwiEYAsGU8JMrlklBMA27+HlJgP6MOo/7JJpQxULM
// 0tq2bh2dLAIrtCIAQyAG8GQLPXQEJdMn4YOe7xnq/ccAa/UdRR0lmH/8V1ZL/9mZ
// 2nbhueg9ytPsDQnG8OMkc2LRyDP+GKBsYd/QgxhWdScDN56g6n4R5JHHdP1oTiR3
// /RvNnOciqVL0khEPtQXPcl1Zt5/nzH9h2T4+yiksqOa2MXuN2rL+9YVrGCO1Rk7x
// 7WDOOsRG8p33LbD/hOjTcXqCWb5c/6rZISqLRJoaddXivKR86vyGFVPJe5fHW5jV
// Zj2JQQIkFAaJRxn1MKHNW6U8fP+ESJmR/CGxZZZRnqHa76pxm44xiX7Oe+mUCMl4
// VNjio6PUXdM4IkTU55HeOAd2btX8ROV1G0E7Cj8Y+lLilqtZRCllnk2qiVdPpAX8
// e7H3XgGx2OOxAqtvbyFqB/ECAwEAAQ==
// -----END PUBLIC KEY-----
// `;

const privateKeyPEM = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAtUnR+OczF0xD7iwdFpJ1krcmkLGlpDs2MkD8HJ66TL0qn48M
Q7Uhq/PaLbtTxdl6oMB1CNM1MrbC+RiVdBt1Clof0ub4JPAkWf7KQh9i1klVEVfq
fTcyykMmU1EXqLRp+X5v4fqPSbaPSR+iHc+JLbrvvTGSSvnVMCN7+a+sK0DaBCup
ubNxSvJhjbWUjaqv+HR+XzzgN+JfDoC2sbIjYEoHcof+ZtBAHWrgmSpgeafwX48I
DtxYbdoyLZ1Wx+ARcT1TqajAiUAfqyo9zUKbWA09igIzpY24DkjpvNtYeNWdftOr
xYxpIa26RBs+0KnKHJVZI8Ux9Z7o2EXG9Mm0ZQIDAQABAoIBAQCvyrt/PsI+L0gX
5lL2lmLIOC1/VaQnkvtE09sk7Y3959kzDAV6imPyV+4TNnlPe0n8I2PZgOUvHiYG
Yh5ajl16Alalri6lsu+tDPKYF9NBs653uOa7MRFhLKg3VoU4pGm28zIO0WastghP
ggs0GREOdR0QOsd/SK+/lEkdn4m2DfSAKGv26Zg6i/LPrfkDzKIdv6wHdjsaeGgL
NMIWnzvAmZWWqEICv15hHEACcfYw7WxHLvqtipDrIFEKcBc8l3aRLyrSLRp8xITV
vXHqmoEe1FI6COKW/RaCeQkGb/GaW909nC0jHtyHB8ZExrurdOT4BX63hwy+CQSa
sdldem0pAoGBAOLLo0jutwgSw0cF5u5FaZqw9Y+hT6M6zzsRnOfOkRk7QXbwh5Nl
wJQFo/eGV43tTeRTCwRN0kbyOdY1GFCRV5eX09GmrcBk3WVY2IIsDCK7w6wBCPfH
6nCEC35AsP7TU+Z1jEiBneZwvhpb1qgfGpFYtxmEfdKa4KyvFrKFUDJ3AoGBAMyi
B+PipF8VaSmU8cgjH1/brr/rjvsx9eizVmaUjihJBnHgHrlymycHACHevtbjH5da
nJy3Kjh0RAV2qHNeqyOZqTQlk3Y+vCJQ0+GkDAmygoZVupMk2hESHfwevqQEJnmd
TlZvF1XAaWEo70JGd90iFrsP4SP9HBWWOIOQQgsDAoGAKtI0NFMOL/IK+N/+aEKm
29RJqSLV/IXgFtEOhR4Ve2QayjBECOqPX+NowBWXdm615ERhsiBXcZnOnclMm/m1
RiQelFkaOVdSDg6mYn2alPxKx7EyVkZi13e3C9F/Gb4g+0R6hj4i6B2lZyir8PZe
d87+U00WzKr9fN1aNb7CE6UCgYBELxUr9J/KYur4hP2PL0zL9voiTs4EmyASGneG
lKdNew+fsArsxeg2t9lub7btCR7EoteeTFXQG8VygJgeYQPrR88eZgrdkofDc2U2
QSAVtxpQwo35a4URvRSqpl/lbNCZIzYwDLIcy5ERY79dOPfFgg9K4z6kbDkIZFaO
V+n5mwKBgQC9ujqpM8jVLxdSuu1dZbKJu+j054Iv45Ev5IojqGUHJCtBYWnP/8kI
Dv07AJ4dn3oetugeoVc3l5pfyo0ChniMollgGIlGTDKYhJpbe1WSnMLL35XKvvFR
aP8HvJfVJtDgBpMASC5I2H99PfkhJU8pzrrHc6jn1lrOpP5aSzho/Q==
-----END RSA PRIVATE KEY-----
`;
const privateKeyPEM_PKCS8 = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1SdH45zMXTEPu
LB0WknWStyaQsaWkOzYyQPwcnrpMvSqfjwxDtSGr89otu1PF2XqgwHUI0zUytsL5
GJV0G3UKWh/S5vgk8CRZ/spCH2LWSVURV+p9NzLKQyZTUReotGn5fm/h+o9Jto9J
H6Idz4ktuu+9MZJK+dUwI3v5r6wrQNoEK6m5s3FK8mGNtZSNqq/4dH5fPOA34l8O
gLaxsiNgSgdyh/5m0EAdauCZKmB5p/BfjwgO3Fht2jItnVbH4BFxPVOpqMCJQB+r
Kj3NQptYDT2KAjOljbgOSOm821h41Z1+06vFjGkhrbpEGz7QqcoclVkjxTH1nujY
Rcb0ybRlAgMBAAECggEBAK/Ku38+wj4vSBfmUvaWYsg4LX9VpCeS+0TT2yTtjf3n
2TMMBXqKY/JX7hM2eU97SfwjY9mA5S8eJgZiHlqOXXoCVqWuLqWy760M8pgX00Gz
rne45rsxEWEsqDdWhTikabbzMg7RZqy2CE+CCzQZEQ51HRA6x39Ir7+USR2fibYN
9IAoa/bpmDqL8s+t+QPMoh2/rAd2Oxp4aAs0whafO8CZlZaoQgK/XmEcQAJx9jDt
bEcu+q2KkOsgUQpwFzyXdpEvKtItGnzEhNW9ceqagR7UUjoI4pb9FoJ5CQZv8Zpb
3T2cLSMe3IcHxkTGu6t05PgFfreHDL4JBJqx2V16bSkCgYEA4sujSO63CBLDRwXm
7kVpmrD1j6FPozrPOxGc586RGTtBdvCHk2XAlAWj94ZXje1N5FMLBE3SRvI51jUY
UJFXl5fT0aatwGTdZVjYgiwMIrvDrAEI98fqcIQLfkCw/tNT5nWMSIGd5nC+GlvW
qB8akVi3GYR90prgrK8WsoVQMncCgYEAzKIH4+KkXxVpKZTxyCMfX9uuv+uO+zH1
6LNWZpSOKEkGceAeuXKbJwcAId6+1uMfl1qcnLcqOHREBXaoc16rI5mpNCWTdj68
IlDT4aQMCbKChlW6kyTaERId/B6+pAQmeZ1OVm8XVcBpYSjvQkZ33SIWuw/hI/0c
FZY4g5BCCwMCgYAq0jQ0Uw4v8gr43/5oQqbb1EmpItX8heAW0Q6FHhV7ZBrKMEQI
6o9f42jAFZd2brXkRGGyIFdxmc6dyUyb+bVGJB6UWRo5V1IODqZifZqU/ErHsTJW
RmLXd7cL0X8ZviD7RHqGPiLoHaVnKKvw9l53zv5TTRbMqv183Vo1vsITpQKBgEQv
FSv0n8pi6viE/Y8vTMv2+iJOzgSbIBIad4aUp017D5+wCuzF6Da32W5vtu0JHsSi
155MVdAbxXKAmB5hA+tHzx5mCt2Sh8NzZTZBIBW3GlDCjflrhRG9FKqmX+Vs0Jkj
NjAMshzLkRFjv10498WCD0rjPqRsOQhkVo5X6fmbAoGBAL26OqkzyNUvF1K67V1l
som76PTngi/jkS/kiiOoZQckK0Fhac//yQgO/TsAnh2feh626B6hVzeXml/KjQKG
eIyiWWAYiUZMMpiEmlt7VZKcwsvflcq+8VFo/we8l9Um0OAGkwBILkjYf309+SEl
TynOusdzqOfWWs6k/lpLOGj9
-----END PRIVATE KEY-----
`;

const publicKeyPEM_PKCS8 = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtUnR+OczF0xD7iwdFpJ1
krcmkLGlpDs2MkD8HJ66TL0qn48MQ7Uhq/PaLbtTxdl6oMB1CNM1MrbC+RiVdBt1
Clof0ub4JPAkWf7KQh9i1klVEVfqfTcyykMmU1EXqLRp+X5v4fqPSbaPSR+iHc+J
LbrvvTGSSvnVMCN7+a+sK0DaBCupubNxSvJhjbWUjaqv+HR+XzzgN+JfDoC2sbIj
YEoHcof+ZtBAHWrgmSpgeafwX48IDtxYbdoyLZ1Wx+ARcT1TqajAiUAfqyo9zUKb
WA09igIzpY24DkjpvNtYeNWdftOrxYxpIa26RBs+0KnKHJVZI8Ux9Z7o2EXG9Mm0
ZQIDAQAB
-----END PUBLIC KEY-----
`;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        privateKeyPEM,
        publicKeyPEM_PKCS8
    };
} else if (window) {
    window.privateKeyPEM = privateKeyPEM_PKCS8;
    window.publicKeyPEM = publicKeyPEM_PKCS8;
}