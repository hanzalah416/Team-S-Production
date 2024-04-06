interface ApiResponse {
  // Define the properties of your response object here
  success: boolean;
  message: string;
}

export const sendLocationData = (
  startId: string,
  endId: string,
): Promise<ApiResponse> => {
  const payload = {
    startId: startId,
    endId: endId,
  };

  console.log("Sending POST request with payload:", JSON.stringify(payload));

  return fetch("YOUR_BACKEND_ENDPOINT", {
    // Replace 'YOUR_BACKEND_ENDPOINT' with your actual backend endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .catch((error: Error) => {
      console.error("Error:", error);
      // Return a default error response in case of failure
      return { success: false, message: "An error occurred" };
    });
};
