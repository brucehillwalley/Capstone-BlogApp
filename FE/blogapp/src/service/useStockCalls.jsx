import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import useAxios from "./useAxios";
import {
  fetchFail,
  fetchStart,
  getProPurBranFirmSuccess,
  getStockSuccess,
  getStockPromiseSuccess,
} from "../features/stockSlice";
import { useDispatch } from "react-redux";

const useStockCalls = () => {
  const { axiosWithToken } = useAxios();
  const dispatch = useDispatch();
  //   const getFirms = async () => {
  // try {
  //    const { data } = await axiosWithToken("/firms/");
  //    dispatch(getFirmsSuccess(data.data))

  // } catch (error) {
  //   dispatch(fetchFail())
  //   toastErrorNotify("Firma bilgileri listelenemedi.")
  // }

  //   };
  //   const getSales = async () => {
  // try {
  //    const { data } = await axiosWithToken("/sales/");
  //    dispatch(getSalesSuccess(data.data))

  // } catch (error) {
  //   dispatch(fetchFail())
  //   toastErrorNotify("Sales bilgileri listelenemedi.")
  // }
  const getStocks = async (url = "firms") => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`/${url}/`);
      //  dispatch(getStockSuccess({data:data.data,url:url}))
      const apiData = data.data;
      dispatch(getStockSuccess({ apiData, url }));
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(`${url} bilgileri listelenemedi.`);
    }
  };

  const getProPurBranFirm = async () => {
    dispatch(fetchStart());

    try {
      const [products, purchases, brands, firms] = await Promise.all([
        axiosWithToken("/products/"),
        axiosWithToken("/purchases/"),
        axiosWithToken("/brands/"),
        axiosWithToken("/firms/"),
      ]);

      dispatch(
        getProPurBranFirmSuccess([
          products?.data?.data,
          purchases?.data?.data,
          brands?.data?.data,
          firms?.data?.data,
        ])
      );
    } catch (error) {
      dispatch(fetchFail());
    }
  };

  //! getStockPromise i getProPurBranFirm yerine genel bir metod yapma çalışmaları.
  const getStockPromise = async (stocks) => {
    dispatch(fetchStart());
    try {
      const promises = stocks.map((stock) => axiosWithToken(`/${stock}/`));
      console.log(promises);
      const promiseResults = await Promise.all(promises);
      // console.log(promiseResults);
      const stockData = promiseResults.map((result, index) => ({
        name: stocks[index],
        data: result?.data?.data,
      }));
      dispatch(getStockPromiseSuccess(stockData));
    } catch (error) {
      dispatch(fetchFail());
    }
  };
  const deleteStock = async (url = "firms", id) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`/${url}/${id}`);
      //! await ve delete yazmayı unutmayın

      toastSuccessNotify(`${url} bilgisi silinmiştir.`);
      getStocks(url);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(`${url} silinemedi.`);
    }
  };
  const postStock = async (url = "firms", info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`/${url}`, info);
      //! await ve post yazmayı unutmayın

      toastSuccessNotify(`${url} kaydı eklenmiştir.`);

      //! global state i güncelleme
      getStocks(url);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(`${url} kaydı eklenememiştir.`);
    }
  };
  const putStock = async (url = "firms", info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.put(`/${url}/${info._id}`, info);
      //! await ve putyazmayı unutmayın

      toastSuccessNotify(`${url} kaydı güncellenmiştir.`);

      //! global state i güncelleme
      getStocks(url);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(`${url} kaydı güncellenememiştir.`);
    }
  };

  return {
    getStocks,
    deleteStock,
    postStock,
    putStock,
    getProPurBranFirm,
    getStockPromise,
  };
};

export default useStockCalls;
