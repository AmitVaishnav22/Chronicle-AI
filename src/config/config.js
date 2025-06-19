const config={
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDataBaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteFunctionId:String(import.meta.env.VITE_APPWRITE_FUNCTION_ID),
    appwriteBookmarkId:String(import.meta.env.VITE_APPWRITE_BOOKMARK_ID),
    appwriteUserId:String(import.meta.env.VITE_APPWRITE_USER_ID),
    appwriteRecentSearchId:String(import.meta.env.VITE_APPWRITE_RECENT_SEARCH_ID),
    newsApiKey:String(import.meta.env.VITE_NEWSAPI_KEY),
    newsApiUrl:String(import.meta.env.VITE_NEWSAPI_URL),
    appwriteUserSearchHistoryId:String(import.meta.env.VITE_APPWRITE_RECENT_USERSEARCH_ID),
    appwriteTopRatedHistoryId:String(import.meta.env.VITE_APPWRITE_TOPRATEDHISTORY_ID),
    appwriteRatingsId:String(import.meta.env.VITE_APPWRITE_RATING_ID),
}

export default config   