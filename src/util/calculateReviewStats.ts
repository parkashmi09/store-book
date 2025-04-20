export function calculateReviewStats(reviews: any) {
    // Sort the reviews array based on ratings
    reviews.sort((a: any, b: any) => b.rating - a.rating);

    const ratingCounts: any = {};
    let totalRatings: number = 0;
    let totalComments: number = 0;
    let sum: any = 0;

    reviews.forEach((review: any) => {
        const rating = Math.round(review.rating);
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;

        sum += review.rating;

        totalRatings++;
        if (review.comment) {
            totalComments++;
        }
    });

    const avg = (sum / reviews.length).toFixed(1);

    // Convert ratingCounts object to an array
    const ratingCountArray = Object.entries(ratingCounts).map(([key, value]) => ({
        rating: parseInt(key),
        count: value
    }));

    // Update each review object to include its sorted rating
    const sortedReviews = reviews.map((review: any) => ({
        ...review,
        rating: Math.round(review.rating)
    }));

    return {
        type: 'reviews',
        data: sortedReviews,
        ratingCounts: ratingCountArray.reverse(),
        totalRatings,
        totalComments,
        avg
    };
}
