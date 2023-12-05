import crypto from 'crypto';

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE!;
const PAYFAST_URL = process.env.NODE_ENV === 'production'
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';

interface PayFastData {
  amount: number;
  item_name: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  email_address: string;
  merchant_id?: string;
  merchant_key?: string;
  signature?: string;
}

export function generatePayFastForm(data: PayFastData) {
  const formData = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: data.return_url,
    cancel_url: data.cancel_url,
    notify_url: data.notify_url,
    name_first: '',
    email_address: data.email_address,
    m_payment_id: '',
    amount: data.amount.toFixed(2),
    item_name: data.item_name,
  };

  // Generate signature
  const signature = generateSignature(formData);

  return {
    url: PAYFAST_URL,
    formData: {
      ...formData,
      signature,
    },
  };
}

function generateSignature(data: Record<string, string>): string {
  // Sort the object by key
  const sortedData = Object.keys(data)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

  // Create the parameter string
  const paramString = Object.entries(sortedData)
    .map(([key, value]) => `${key}=${encodeURIComponent(value.trim())}`)
    .join('&');

  // Add passphrase if it exists
  const stringToHash = PAYFAST_PASSPHRASE
    ? `${paramString}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE.trim())}`
    : paramString;

  // Generate signature
  return crypto.createHash('md5').update(stringToHash).digest('hex');
}

export function validatePayFastResponse(data: Record<string, string>): boolean {
  const receivedSignature = data.signature;
  delete data.signature;

  const generatedSignature = generateSignature(data);
  return receivedSignature === generatedSignature;
} //  
