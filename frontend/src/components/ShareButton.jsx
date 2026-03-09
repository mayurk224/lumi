import { useState } from 'react'
import { FiShare2, FiCheck, FiCopy } from 'react-icons/fi'
import toast from 'react-hot-toast'

function ShareButton({ title, text, url = window.location.href }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Last resort: try clipboard again
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          toast.success('Link copied!')
          setTimeout(() => setCopied(false), 2000)
        } catch {
          toast.error('Failed to share')
        }
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all border
        ${copied
          ? 'bg-green-500/20 border-green-500/50 text-green-400'
          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
        }`}
      title="Share"
    >
      {copied ? (
        <>
          <FiCheck className="w-4 h-4" /> Copied!
        </>
      ) : (
        <>
          <FiShare2 className="w-4 h-4" /> Share
        </>
      )}
    </button>
  )
}

export default ShareButton
