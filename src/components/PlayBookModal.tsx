import { XIcon } from 'lucide-react'
interface PlayBookModalProps {
  isOpen: boolean
  onClose: () => void
}
export function PlayBookModal({ isOpen, onClose }: PlayBookModalProps) {
  if (!isOpen) return null
  return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1F2937] rounded-2xl w-full max-w-3xl overflow-hidden">
          <div className="relative p-6">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XIcon size={24} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Coins Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/vD9N9vM2M65c4oq3nT2jFf/Gold_Coins.png"
                        alt="Gold Coins"
                        className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Gold Coins
                  </h3>
                </div>
                <p className="text-white">
                  Gold Coins are your main in-game currency. Use them to play any
                  of our games! You can get more Gold Coins by buying them in the
                  store, winning them in Wordoll and Lockpickr, or from giveaways.
                </p>
              </div>
              {/* Vouchers Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/3YTVbiE1DuPqiMrrdaLvve/Vouchers.png"
                        alt="Vouchers"
                        className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">Vouchers</h3>
                </div>
                <p className="text-white">
                  Earn Vouchers by playing Lockpickr and Wordoll. Vouchers let you
                  spin the Giveaway Spin for bonus prizes and gems!
                </p>
              </div>
              {/* Entries Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/pghjseEomEmEhcxZ1KTDRe/Entries.png"
                        alt="Entries"
                        className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">Entries</h3>
                </div>
                <p className="text-white">
                  Entries are special passes that let you join paid rooms and
                  compete in skill-based games for a chance to win Gems.
                </p>
              </div>
              {/* Lucky Meter Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/nsm9dStD4yr2m3TCXP3A67/Lucky_Meter.png"
                        alt="Lucky Meter"
                        className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Lucky Meter
                  </h3>
                </div>
                <p className="text-white">
                  Your Lucky Meter is visible in your account section. The more
                  you share your personalized game link, the higher your Lucky
                  Meter goes, boosting your chances to win in lucky draws and
                  spins! (Note: The Lucky Meter doesn't affect outcomes in
                  skill-based games.)
                </p>
              </div>
              {/* Gems Section */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLaoa9Q2SuXLLGphZCDzFr/Gems.png"
                        alt="Gems"
                        className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">Gems</h3>
                </div>
                <p className="text-white">
                  Gems are a premium reward. If you collect enough Gems, you can
                  redeem and transfer them as funds to your bank account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
