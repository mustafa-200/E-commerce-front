import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { fetchAddresses, createAddress } from "../api/addresses";
import api from "../api/axios";
import { formatCurrency } from "../utils/currency";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";


const emptyAddressForm = {
  full_name: "",
  phone: "",
  city: "",
  area: "",
  street: "",
};

export default function Checkout() {
  const {
    items,
    total,
    loading: cartLoading,
    refreshCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [orderPlaced, setOrderPlaced] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Redirect User If Not Authenticated
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: "/checkout",
        },
      });
    }
  }, [user, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Redirect If Cart Is Empty
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (orderPlaced) return; // لو الطلب اتنفذ خلاص، متعملش أي redirect تاني
    if (!cartLoading && items.length === 0) {
      navigate("/cart");
    }
  }, [cartLoading, items.length, navigate, orderPlaced]);

  /*
  |--------------------------------------------------------------------------
  | Fetch User Addresses
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!user) return;

    const loadAddresses = async () => {
      try {
        setLoadingAddresses(true);

        const list = await fetchAddresses();

        setAddresses(list);

        const defaultAddress =
          list.find((address) => address.is_default) || list[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          "تعذر تحميل العناوين المحفوظة."
        );
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [user]);

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (!user || cartLoading || items.length === 0) {
    return (
      <Spinner
        label="جاري تحميل صفحة الدفع..."
        className="py-24"
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Address Form Change
  |--------------------------------------------------------------------------
  */

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Save New Address
  |--------------------------------------------------------------------------
  */

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const newAddress = await createAddress(addressForm);

      setAddresses((prev) => [
        ...prev,
        newAddress,
      ]);

      setSelectedAddressId(newAddress.id);

      setShowNewAddressForm(false);

      setAddressForm(emptyAddressForm);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "تعذر حفظ العنوان."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Checkout
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedAddressId) {
      setError("اختر عنوان الشحن أولاً.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/checkout", {
        payment_method: paymentMethod,
        address_id: selectedAddressId,
      });

      setOrderPlaced(true); // 👈 نمنع الـ redirect القديم من التدخل من هنا

      await refreshCart();

      navigate("/order-confirmation", {
        state: {
          order: response.data.data,
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "حدث خطأ أثناء إتمام الطلب. حاول مرة أخرى."
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div
      dir="rtl"
      className="max-w-3xl mx-auto px-4 md:px-10 py-10 min-h-[60vh]"
    >
      {/* Page Title */}

      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-right">
        إتمام الشراء
      </h1>

      {/* Error */}

      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        </div>
      )}

      {/* ========================= */}
      {/* Shipping Address */}
      {/* ========================= */}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            عنوان الشحن
          </h2>

          {!showNewAddressForm && !loadingAddresses && (
            <button
              type="button"
              onClick={() => setShowNewAddressForm(true)}
              className="text-teal-600 font-semibold text-sm hover:underline"
            >
              + إضافة عنوان جديد
            </button>
          )}
        </div>

        {/* Loading Addresses */}

        {loadingAddresses ? (
          <div className="py-6">
            <Spinner
              label="جاري تحميل العناوين..."
              className="py-8"
            />
          </div>
        ) : (
          <>
            {/* Saved Addresses */}

            {addresses.length > 0 && (
              <div className="flex flex-col gap-3 mb-4">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`
                      border rounded-xl p-4
                      flex items-start gap-3
                      cursor-pointer
                      transition-all
                      ${selectedAddressId === address.id
                        ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
                        : "border-gray-300 hover:border-teal-400"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={
                        selectedAddressId === address.id
                      }
                      onChange={() =>
                        setSelectedAddressId(address.id)
                      }
                      className="mt-1 accent-teal-600"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900">
                          {address.full_name}
                        </p>

                        {address.is_default && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                            العنوان الافتراضي
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {address.phone}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {address.city}، {address.area}،{" "}
                        {address.street}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* New Address Form */}

            {showNewAddressForm && (
              <form
                onSubmit={handleSaveNewAddress}
                className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col gap-4"
              >
                <h3 className="font-bold text-gray-800">
                  إضافة عنوان جديد
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    الاسم الكامل
                  </label>

                  <input
                    required
                    name="full_name"
                    value={addressForm.full_name}
                    onChange={handleAddressFormChange}
                    placeholder="مثال: خالد جمال"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    رقم الهاتف
                  </label>

                  <input
                    required
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressFormChange}
                    placeholder="01xxxxxxxxx"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      المدينة
                    </label>

                    <input
                      required
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      placeholder="المدينة"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      المنطقة
                    </label>

                    <input
                      required
                      name="area"
                      value={addressForm.area}
                      onChange={handleAddressFormChange}
                      placeholder="المنطقة"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    الشارع والعنوان بالتفصيل
                  </label>

                  <input
                    required
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressFormChange}
                    placeholder="اسم الشارع ورقم المنزل"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all"
                  >
                    حفظ العنوان
                  </button>

                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewAddressForm(false);
                        setAddressForm(emptyAddressForm);
                      }}
                      className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* No Addresses */}

            {!loadingAddresses &&
              addresses.length === 0 &&
              !showNewAddressForm && (
                <div className="text-center border border-dashed border-gray-300 rounded-xl p-8">
                  <p className="text-gray-500 mb-4">
                    لا يوجد لديك عناوين محفوظة.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewAddressForm(true)
                    }
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    إضافة عنوان جديد
                  </button>
                </div>
              )}
          </>
        )}
      </section>

      {/* ========================= */}
      {/* Payment Method */}
      {/* ========================= */}

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          طريقة الدفع
        </h2>

        <div className="flex flex-col gap-3">
          <label
            className={`
              border rounded-xl p-4
              flex items-center gap-3
              cursor-pointer
              ${paymentMethod === "cod"
                ? "border-teal-600 bg-teal-50"
                : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="payment_method"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="accent-teal-600"
            />

            <div>
              <p className="font-semibold text-gray-900">
                الدفع عند الاستلام
              </p>

              <p className="text-sm text-gray-500">
                ادفع عند استلام طلبك
              </p>
            </div>
          </label>

          <label
            className={`
              border rounded-xl p-4
              flex items-center gap-3
              cursor-pointer
              ${paymentMethod === "whatsapp"
                ? "border-teal-600 bg-teal-50"
                : "border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name="payment_method"
              value="whatsapp"
              checked={paymentMethod === "whatsapp"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="accent-teal-600"
            />

            <div>
              <p className="font-semibold text-gray-900">
                الطلب عبر واتساب
              </p>

              <p className="text-sm text-gray-500">
                سيتم التواصل معك عبر واتساب لتأكيد الطلب
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* ========================= */}
      {/* Order Summary */}
      {/* ========================= */}

      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          ملخص الطلب
        </h2>

        <div className="flex flex-col gap-3 mb-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex-1 text-right">
                <p className="font-semibold text-gray-800">
                  {item.product?.name}
                </p>
                <p className="text-gray-500">
                  الكمية: {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-gray-800">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-lg text-gray-900">
          <span>المجموع الكلي</span>

          <span className="text-teal-600">
            {formatCurrency(total)}
          </span>
        </div>
      </section>

      {/* ========================= */}
      {/* Submit */}
      {/* ========================= */}

      <button
        onClick={handleSubmit}
        disabled={submitting || !selectedAddressId}
        className="
          w-full
          mt-6
          bg-teal-600
          disabled:bg-gray-300
          disabled:cursor-not-allowed
          text-white
          py-4
          rounded-xl
          font-bold
          text-lg
          hover:bg-teal-700
          transition-all
          active:scale-[0.98]
        "
      >
        {submitting
          ? "جاري تنفيذ الطلب..."
          : "تأكيد الطلب"}
      </button>
    </div>
  );
}


