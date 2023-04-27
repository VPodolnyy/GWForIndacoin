import axios from "axios"

let API_LINK = 'https://api.indacoin.io'
// Условие для Stage
if (window.location.origin === 'https://sgw.indacoin.io') API_LINK = 'https://sapi.indacoin.io'


const BaseRequest = {
  post(url, params = {}, headers = {}) {
    const protocol = /^http(s)?/.test(url);
    return axios.post(protocol ? url : API_LINK + url, params, {
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    });
  },

  get(url, params = {}) {
    const protocol = /^http(s)?/.test(url);
    return axios.get(protocol ? url : API_LINK + url, params, {
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    });
  },

  put(url, params = {}, headers = {}) {
    const protocol = /^http(s)?/.test(url);
    return axios.put(protocol ? url : API_LINK + url, params, {
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    });
  },
}

export default {
  
  Calculator(curInID, curOutID, amount, networkID, PartnerApiKey) {
    return BaseRequest.get(`/api/v1/GatewayRequests/GetCoinConvertAmountOut?CurIn=${curInID}&CurOut=${curOutID}&AmountIn=${amount}&Network=${networkID}${PartnerApiKey ? `&PartnerApiKey=${PartnerApiKey}`: ''}`)
      .then(response => {
        if ((response || {}).data) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      })
  },

  // Отправка первичных данных для создания платежки
  Exchange(params) {
    return BaseRequest.post(`/api/v1/GatewayRequests/CreateGatewayRequest`, params)
      .then(response => {
        if ((response || {}).data || {}) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      }
      ).catch(e => {
        Promise.reject(e);
      });
  },

  ExchangeWallet(params) {
    return BaseRequest.post(`/api/v1/GatewayRequests/CreateWalletGatewayRequest`, params)
      .then(response => {
        if ((response || {}).status === 200) return response.data;
        else return Promise.reject(response)
      })
  },

  // Получение данных о транзакции
  ExchangeCheck(id, hash) {
    return BaseRequest.get(`/api/v1/CommonRequests/${id}?hash=${hash}`)
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      }
      ).catch(e => {
        Promise.reject(e);
      });
  },

  // Подтверждение суммы обмена
  ConfirmExchange(exchangeRequestId, hash, params) {
    return BaseRequest.post(`/api/v1/GatewayRequests/${exchangeRequestId}/ConfirmGatewayRequest?hash=${hash}`, params)
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      }
      ).catch(e => {
        Promise.reject(e);
      });
  },

  TestPurchase ( requestId, hash, params ) {
    return BaseRequest.post(`/api/v1/CommonRequests/${requestId}/ConfirmRequestTestPurchase?hash=${hash}`, params)
    .then(response => {
        if ((response || {}.data)) {
            return response.data;
        } else {
            return Promise.reject(response);
        }
    })
  },

  sendWallet(requestId, hash, wallet, networkId) {
    return BaseRequest.post(`/api/v1/CommonRequests/${requestId}/ProvideCashoutInfo?hash=${hash}`, { cryptoAddress: wallet, networkId: networkId })
      .then(response => {
        if ((response || {}.data)) {
          return response;
        } else {
          return Promise.reject(response);
        }
      })
  },

  // Отмена Exchange
  CancelExchange(requestId, hash) {
    return BaseRequest.post(`/api/v1/CommonRequests/${requestId}/CancelByUser?hash=${hash}`)
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      }
      ).catch(e => {
        Promise.reject(e);
      });
  },

  PartnerConfig(id, partnerId) {
    return BaseRequest.get(`api/v1/PartnerSettings/${id}/ByPartnerId?partnerId=${partnerId}`)
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      })
  },

  Currencies() {
    return BaseRequest.get(`/api/v1/Data/currencies?sourceType=Exchanger`)
      .then(response => {
        if (response) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      }).catch(e => {
        Promise.reject(e);
      })
  },

  Countries() {
    return BaseRequest.get(`/api/v1/Data/countries`)
      .then(response => {
        if (response) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      }).catch(e => {
        Promise.reject(e);
      })
  },

  Cashin(params) {
    return BaseRequest.post(`/api/v1/CashinPayments/AuthorizeCashinPayment`, params)
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response)
        }
      }
      ).catch(e => { Promise.reject(e) })
  },

  // Сообщаем бэку о прохождении 3ds
  CashinCheck(id) {
    return BaseRequest.post(`/api/v1/CashinPayments/${id}/checkByRequestId`)
      .then(response => {
        if (response?.data) return response.data;
        else return Promise.reject(response)
      }
      ).catch(e => Promise.reject(e))
  },

  UserInfo() {
    return BaseRequest.get(`/api/v1/Information/CheckIp`)
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      })
  },

  // Отправка телефона и отправка кода проверки
  AddContacts(params) {
    return BaseRequest.post(`/api/v1/ContactSession/CreateRequestContactSession`, params)
      .then(response => {
        if ((response || {}).status === 200) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      })
  },

  // Повторная отправка кода
  Sendcode(id, hash) {
    return BaseRequest.post(`/api/v1/ContactSession/SendRequestContactSessionVerificationCode`, { requestId: id, hash: hash })
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      }
      ).catch(e => {
        Promise.reject(e);
      });
  },

  // Проверка введенного кода
  Verify(id, hash, verifycode) {
    return BaseRequest.post(`/api/v1/ContactSession/VerifyRequestContactSession`, { requestId: id, hash: hash, verificationCode: verifycode })
      .then(response => {
        if ((response || {}.data)) {
          return response;
        } else {
          return Promise.reject(response);
        }
      })
  },
  // Получение токена для обращения к KYC
  AccessToken(requestId, hash) {
    return BaseRequest.post(`/api/v1/TradeUser/GetSumsubJwt`, { requestId, hash })
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      }
      ).catch(e => {
        Promise.reject(e);
      });
  },

  Check(requestId, hash) {
    return BaseRequest.post(`/api/v1/TradeUser/CheckSumsubApplicant`, { requestId, hash })
      .then(response => {
        if ((response || {}.data)) {
          return response;
        } else {
          return Promise.reject(response);
        }
      })
  },



  AddressInWallet(id, hash) {
    return BaseRequest.post(`/api/v1/GatewayRequests/${id}/SkipCashoutInfo?hash=${hash}`)
      .then(response => {
        if ((response || {}.data)) {
          return response.data;
        } else {
          return Promise.reject(response);
        }
      }
      ).catch(e => {
        Promise.reject(e);
      });
  }
}