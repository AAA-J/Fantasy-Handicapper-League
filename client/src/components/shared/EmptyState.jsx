import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Search, 
  Plus, 
  Users, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  Filter
} from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = BarChart3,
  title,
  description,
  action,
  actionText,
  onAction,
  className = '',
  size = 'lg'
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <motion.div 
      className={`text-center py-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex justify-center mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`${iconSizes[size]} text-gray-400`}>
          <Icon className="w-full h-full" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <motion.button
          onClick={onAction}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {action}
          {actionText && <span className="ml-2">{actionText}</span>}
        </motion.button>
      )}
    </motion.div>
  );
};

// Specific empty states
export const NoContractsEmptyState = ({ onCreateContract }) => (
  <EmptyState
    icon={BarChart3}
    title="No contracts found"
    description="There are no prediction contracts available. Create the first one to get started!"
    action={<Plus className="w-4 h-4" />}
    actionText="Create Contract"
    onAction={onCreateContract}
  />
);

export const NoSearchResultsEmptyState = ({ onClearFilters }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description="Try adjusting your search terms or filters to find what you're looking for."
    action={<Filter className="w-4 h-4" />}
    actionText="Clear Filters"
    onAction={onClearFilters}
  />
);

export const NoBetsEmptyState = ({ onPlaceBet }) => (
  <EmptyState
    icon={TrendingUp}
    title="No bets placed"
    description="You haven't placed any bets yet. Start by exploring available contracts and placing your first bet!"
    action={<Plus className="w-4 h-4" />}
    actionText="Browse Contracts"
    onAction={onPlaceBet}
  />
);

export const NoUsersEmptyState = ({ onInviteUsers }) => (
  <EmptyState
    icon={Users}
    title="No users found"
    description="There are no users in the system yet. Invite some friends to start competing!"
    action={<Plus className="w-4 h-4" />}
    actionText="Invite Users"
    onAction={onInviteUsers}
  />
);

export const ErrorEmptyState = ({ onRetry, error }) => (
  <EmptyState
    icon={AlertCircle}
    title="Something went wrong"
    description={error || "An unexpected error occurred. Please try again."}
    action={<RefreshCw className="w-4 h-4" />}
    actionText="Try Again"
    onAction={onRetry}
  />
);

export const LoadingEmptyState = () => (
  <motion.div 
    className="text-center py-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      className="w-12 h-12 mx-auto mb-4"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <RefreshCw className="w-full h-full text-blue-600" />
    </motion.div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Loading...
    </h3>
    <p className="text-gray-600">
      Please wait while we fetch the data.
    </p>
  </motion.div>
);

export const ComingSoonEmptyState = ({ feature }) => (
  <EmptyState
    icon={BarChart3}
    title={`${feature} Coming Soon`}
    description="This feature is currently under development. Check back later for updates!"
    size="xl"
  />
);

export const MaintenanceEmptyState = () => (
  <EmptyState
    icon={AlertCircle}
    title="Under Maintenance"
    description="We're currently performing scheduled maintenance. The service will be back online shortly."
    size="xl"
  />
);

export const OfflineEmptyState = ({ onRetry }) => (
  <EmptyState
    icon={AlertCircle}
    title="You're offline"
    description="Please check your internet connection and try again."
    action={<RefreshCw className="w-4 h-4" />}
    actionText="Retry"
    onAction={onRetry}
  />
);

export const PermissionDeniedEmptyState = ({ requiredPermission }) => (
  <EmptyState
    icon={AlertCircle}
    title="Access Denied"
    description={`You don't have permission to view this content. ${requiredPermission ? `Required: ${requiredPermission}` : ''}`}
    size="lg"
  />
);

export const NotFoundEmptyState = ({ resource = "page" }) => (
  <EmptyState
    icon={Search}
    title={`${resource.charAt(0).toUpperCase() + resource.slice(1)} not found`}
    description={`The ${resource} you're looking for doesn't exist or has been moved.`}
    size="lg"
  />
);

export default EmptyState;
