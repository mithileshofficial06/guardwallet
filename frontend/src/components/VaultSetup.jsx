import { useState } from 'react';

export default function VaultSetup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [survivalMinimum, setSurvivalMinimum] = useState('');
  const [trustedCircle, setTrustedCircle] = useState(['', '', '']);
  const [autopays, setAutopays] = useState([{ name: '', amount: '', date: '' }]);

  const handleSubmit = () => {
    // Contract interaction here
    console.log('Creating vault...');
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-1/3 h-2 rounded ${
                  s <= step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Set Your Survival Minimum</h2>
            <p className="text-gray-600 mb-6">
              This is the minimum amount you need to survive until next salary.
              GuardWallet will protect funds before you go below this amount.
            </p>
            
            <label className="block mb-2 text-sm font-medium">
              Survival Minimum (USDC)
            </label>
            <input
              type="number"
              value={survivalMinimum}
              onChange={(e) => setSurvivalMinimum(e.target.value)}
              className="w-full border rounded-lg p-3 mb-6"
              placeholder="e.g., 500"
            />

            <button
              onClick={() => setStep(2)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Add Trusted Circle</h2>
            <p className="text-gray-600 mb-6">
              Add 2-3 trusted family members or friends who can approve emergency withdrawals.
              They'll receive email notifications (no wallet needed).
            </p>

            {trustedCircle.map((address, idx) => (
              <div key={idx} className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Trusted Person {idx + 1}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    const newCircle = [...trustedCircle];
                    newCircle[idx] = e.target.value;
                    setTrustedCircle(newCircle);
                  }}
                  className="w-full border rounded-lg p-3"
                  placeholder="Email or wallet address"
                />
              </div>
            ))}

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="w-1/2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-1/2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Schedule Your Autopays</h2>
            <p className="text-gray-600 mb-6">
              Add all your recurring payments. GuardWallet will protect funds before each payment date.
            </p>

            {autopays.map((autopay, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg">
                <input
                  type="text"
                  value={autopay.name}
                  onChange={(e) => {
                    const newAutopays = [...autopays];
                    newAutopays[idx].name = e.target.value;
                    setAutopays(newAutopays);
                  }}
                  className="w-full border rounded p-2 mb-2"
                  placeholder="Payment name (e.g., Rent)"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={autopay.amount}
                    onChange={(e) => {
                      const newAutopays = [...autopays];
                      newAutopays[idx].amount = e.target.value;
                      setAutopays(newAutopays);
                    }}
                    className="border rounded p-2"
                    placeholder="Amount"
                  />
                  <input
                    type="date"
                    value={autopay.date}
                    onChange={(e) => {
                      const newAutopays = [...autopays];
                      newAutopays[idx].date = e.target.value;
                      setAutopays(newAutopays);
                    }}
                    className="border rounded p-2"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => setAutopays([...autopays, { name: '', amount: '', date: '' }])}
              className="text-indigo-600 mb-6"
            >
              + Add Another
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(2)}
                className="w-1/2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="w-1/2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
              >
                Create Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
