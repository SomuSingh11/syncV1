export default function Footer() {
    return (
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} SyncCity. All rights reserved.
        </div>
      </footer>
    );
  }
  