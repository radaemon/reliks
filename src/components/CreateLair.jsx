import { useState } from 'react'
import { useMoralis } from 'react-moralis'
import { ethers } from '../util/deployWhale'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { createWhaleFactory } from '../util/deployWhale'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { BenefitsLairPanel } from './BenefitsLairPanel'
import { LoadingModal } from './LoadingModal'
const {
  utils: { parseEther },
} = ethers

export function CreateLair() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()
  const { web3, setUserData } = useMoralis()
  const [modalOpen, setModalOpen] = useState(false)
  const [currentTxn, setCurrentTxn] = useState({})

  const deployWhale = async ({ whales, price }) => {
    try {
      // need to pass signer to Factory with dynamic chainId's
      const WhaleFactory = createWhaleFactory(web3.getSigner())
      const contract = await WhaleFactory.deploy(
        process.env.NEXT_PUBLIC_APP_ADDRESS,
        whales,
        parseEther(String(price))
      )
      toast.success(`contract address: ${contract.address}`)
      // setModalOpen(true)

      await contract.deployed()
      toast.success(`contract deployed succesfully`)
      // setCurrentTxn({ hash: contract.address, loading: true })

      await setUserData({
        whaleStrategy: { lairAddress: contract.address, initialLairEntry: +price },
      })
      // setCurrentTxn({ ...currentTxn, loading: false })
    } catch (err) {
      toast.error('could not deploy contract')
    }
  }

  return (
    <>
      {/* <LoadingModal
        open={modalOpen}
        setOpen={setModalOpen}
        txn={currentTxn}
        loading={currentTxn.loading}
      /> */}
      <div className='relative mx-10 mt-10'>
        <div className='absolute inset-0' aria-hidden='true'>
          <div className='inset-y-0 right-0 w-1/2 bg-light-violet9 bg-gradient-to-r from-light-violet8 to-light-violet9 dark:from-darkMode-violet8 dark:to-darkMode-violet9 lg:absolute' />
        </div>
        <div className='relative mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:px-8'>
          <BenefitsLairPanel />
          <div className='mt-8 w-full sm:flex sm:items-start md:pl-8 lg:mx-0 lg:bg-none'>
            <form
              className='mx-auto mt-3 rounded-2xl bg-gradient-to-r from-light-violet8 to-light-violet9 p-4 text-left dark:from-darkMode-violet8 dark:to-darkMode-violet9 sm:mt-0'
              onSubmit={handleSubmit((a) => deployWhale(a))}>
              <h2 className='text-3xl font-semibold leading-6 text-light-violet12 dark:text-darkMode-violet12'>
                Whales&apos; Lair
              </h2>
              <div className='mx-auto mt-5 flex flex-col gap-2'>
                {/* number of whales */}
                <div>
                  <div className='mb-2 text-base text-light-violet1 dark:text-darkMode-gray dark:opacity-80'>
                    Maximum amount of whales allowed in the lair at any given moment.
                  </div>
                  <label
                    htmlFor='whales'
                    className='mb-1 block text-sm font-bold text-light-violet12 dark:text-darkMode-violet12'>
                    Noº whales*
                  </label>

                  <input
                    {...register('whales', {
                      required: true,
                      min: 5,
                      max: 100,
                    })}
                    type='number'
                    name='whales'
                    id='whales'
                    className={`${
                      errors.whales
                        ? ' border border-error focus:border-error focus:ring-error'
                        : 'border-light-bordergray  focus:border-light-violet7 focus:ring-light-violet7 '
                    } w-full rounded-md bg-white  shadow-sm disabled:cursor-not-allowed  disabled:opacity-50 dark:border-mauve dark:bg-darkMode-violet2 sm:text-sm`}
                    placeholder='15'
                  />
                  {/* error whale number */}
                  <div className='h-4'>
                    {errors.whales && (
                      <div className='flex items-center'>
                        <IoCloseCircleSharp className='birder text-[#942f1e] dark:text-[#ff1a60] ' />
                        <p className='text-sm font-semibold tracking-wide text-[#942e2e] opacity-100  dark:text-error dark:brightness-125'>
                          Whale count must be from 5 to 100
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* price */}
                <div>
                  <div className='mb-2 text-base text-light-violet1 dark:text-darkMode-gray dark:opacity-80'>
                    Initial cost of entry to the lair (before lair is full).
                  </div>
                  <label
                    htmlFor='price'
                    className='mb-1 block text-sm font-bold text-light-violet12 dark:text-darkMode-violet12'>
                    Price*
                  </label>
                  <div className='relative mt-1 rounded-md shadow-sm'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <span className='flex items-center sm:text-sm'>
                        <Image width={9} height={14} src='/ethereum.svg' alt='eth' />
                      </span>
                    </div>
                    <input
                      {...register('price', { required: true })}
                      type='number'
                      name='price'
                      id='price'
                      className={`${
                        errors.price
                          ? ' border border-error focus:border-error focus:ring-error'
                          : 'border-light-bordergray  focus:border-light-violet7 focus:ring-light-violet7  dark:border-mauve'
                      } w-full rounded-md  bg-white pl-8 shadow-sm  disabled:cursor-not-allowed disabled:opacity-50 dark:border-mauve dark:bg-darkMode-violet2 sm:text-sm`}
                      placeholder='0'
                    />
                    <div className='pointer-events-none absolute inset-y-0 right-6 flex items-center pr-3'>
                      <span className=' sm:text-sm' id='price-currency'>
                        ETH
                      </span>
                    </div>
                  </div>
                  {/* error whale number */}
                  <div className='h-4'>
                    {errors.price && (
                      <div className='flex items-center'>
                        <IoCloseCircleSharp className='birder text-[#942f1e] dark:text-[#ff1a60] ' />
                        <p className='text-sm font-semibold tracking-wide text-[#942e2e] opacity-100  dark:text-error dark:brightness-125'>
                          Min 0.1 ETH
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className='mt-5 md:mt-0'>
                  <input
                    className='flex w-full  cursor-pointer items-center justify-center rounded-md bg-mauve py-2 px-8 text-lg font-medium leading-6 text-light-violet1 hover:opacity-80 dark:bg-white dark:text-darkMode-violet1 md:py-4 md:px-10'
                    type='submit'
                    value='Deploy Contract'
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
