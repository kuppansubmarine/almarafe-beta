import { useRef, useState, useEffect} from 'react';
import toast, { Toaster } from "react-hot-toast";

const FeedbackComponent = () => {
    const [showFeedback, setShowFeedback] = useState(false); // State to manage feedback box visibility
    const [feedback, setFeedback] = useState(""); // State to store feedback
    const feedbackRef = useRef<HTMLDivElement | null>(null); // Ref to track the feedback box for scrolling
  
    // Function to reveal the feedback box and scroll to it
    const handleShowFeedback = () => {
      setShowFeedback(showFeedback ? false : true); // Show the feedback box
    };
  
    // Scroll to the feedback box after it becomes visible
    useEffect(() => {
      if (showFeedback && feedbackRef.current) {
        feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [showFeedback]); // Trigger the scroll when the feedback box becomes visible
  
    return (
      <>
        {/* Your existing input fields */}
  
        <p
          className="cursor-pointer text-blue-500 hover:underline mt-4"
          onClick={handleShowFeedback} // When clicked, show feedback and scroll to it
        >
          Are we missing a search field?
        </p>
  
        {showFeedback && (
          <div ref={feedbackRef} className="mt-4 p-4 border border-gray-300 rounded-md">
            <label className="block text-sm font-medium text-gray-700">
              Please let us know what we are missing:
            </label>
            <textarea
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe the missing field..."
            />
            <button
              onClick={() => {
                console.log("Feedback submitted:", feedback);
                toast.success("Feedback Submitted!");
                setShowFeedback(false); // Close the feedback box after submission
                setFeedback(""); // Clear the feedback after submission
              }}
              className="mt-2 px-4 py-2 bg-[#67a2e1] text-white rounded-md hover:bg-[#5590ce]"
            >
              Submit Feedback
            </button>
          </div>
        )}

      </>
    );
  };
  
  export default FeedbackComponent;