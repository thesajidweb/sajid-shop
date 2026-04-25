Here's a comprehensive guide on how to use the `ErrorBox` component in your Next.js application:

## 1. **Basic Usage**

### Simple Error Display
```tsx
import ErrorBox from "@/components/ErrorBox";

export default function MyComponent() {
  return (
    <div>
      <ErrorBox />
    </div>
  );
}
```

### With Custom Message
```tsx
<ErrorBox 
  message="Failed to load user data. Please check your connection."
/>
```

## 2. **Common Use Cases**

### With Error Object from try/catch
```tsx
"use client";

import { useState } from "react";
import ErrorBox from "@/components/ErrorBox";

export default function DataFetchingComponent() {
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      // Process data...
    } catch (err) {
      setError(err as Error);
    }
  };

  if (error) {
    return (
      <ErrorBox 
        error={error}
        message="Unable to load users"
        onRetry={fetchData}
      />
    );
  }

  return <div>Your content here</div>;
}
```

### With React Query (TanStack Query)
```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import ErrorBox from "@/components/ErrorBox";

export default function PostsComponent() {
  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <ErrorBox 
        error={error}
        title="Failed to load posts"
        onRetry={() => refetch()}
        retryText="Retry loading posts"
      />
    );
  }

  return <div>{/* Render posts */}</div>;
}
```

## 3. **Auto-Refresh Examples**

### Auto-refresh after 5 seconds
```tsx
<ErrorBox 
  message="Connection lost. Reconnecting..."
  autoRefresh={true}
  refreshDelay={5000}
/>
```

### Auto-refresh with custom retry
```tsx
<ErrorBox 
  error={error}
  autoRefresh={true}
  refreshDelay={3000}
  onRetry={() => {
    // Custom retry logic before refresh
    console.log("Attempting to reconnect...");
    websocket.reconnect();
  }}
/>
```

## 4. **Different Error Types**

### Group-specific Error
```tsx
// This will automatically show group-specific message
<ErrorBox 
  error={new Error("Failed to fetch group data")}
  message="Group error occurred"
/>
// OR
<ErrorBox message="Group synchronization failed" />
```

### With Error Details (for debugging)
```tsx
<ErrorBox 
  error={error}
  showErrorDetails={true}
  title="Debug Mode"
/>
```

## 5. **Layout Integration Examples**

### Full Page Error
```tsx
// app/error.tsx (Next.js error boundary)
"use client";

import ErrorBox from "@/components/ErrorBox";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-screen">
      <ErrorBox 
        error={error}
        title="Application Error"
        onRetry={reset}
        retryText="Reset page"
      />
    </div>
  );
}
```

### Component-level Error Boundary
```tsx
"use client";

import { Component, ReactNode } from "react";
import ErrorBox from "@/components/ErrorBox";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBox 
          error={this.state.error}
          title="Component Error"
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}
```

### Modal/Popup Error
```tsx
"use client";

import { Dialog } from "@/components/ui/dialog";
import ErrorBox from "@/components/ErrorBox";
import { useState } from "react";

export default function ModalWithError() {
  const [showError, setShowError] = useState(false);

  return (
    <>
      <button onClick={() => setShowError(true)}>Show Error</button>
      
      {showError && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <ErrorBox 
              message="Operation failed"
              onRetry={() => {
                setShowError(false);
                // Retry logic here
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
```

## 6. **Form Submission Errors**

```tsx
"use client";

import { useState } from "react";
import ErrorBox from "@/components/ErrorBox";

export default function ContactForm() {
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Submission failed');
      
      // Success handling
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <ErrorBox 
        error={error}
        title="Form Submission Failed"
        message="Please check your input and try again"
        onRetry={() => setError(null)}
        retryText="Go back to form"
      />
    );
  }

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

## 7. **With Loading States**

```tsx
"use client";

import { useState } from "react";
import ErrorBox from "@/components/ErrorBox";

export default function DataWithRetry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Fetch data...
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <ErrorBox 
        error={error}
        onRetry={loadData}
        retryText="Retry loading"
      />
    );
  }

  return (
    <div>
      <button onClick={loadData}>Load Data</button>
    </div>
  );
}
```

## 8. **Custom Styling**

```tsx
<ErrorBox 
  className="min-h-[400px] bg-gray-50"
  title="Custom Error"
  message="This has custom styling"
/>

<!-- With Tailwind customization -->
<ErrorBox 
  className="my-8 mx-4"
  title="⚠️ Warning"
  message="Something unexpected happened"
/>
```

## Key Props Reference:

| Prop               | Type                          | Default                  | Description                |
| ------------------ | ----------------------------- | ------------------------ | -------------------------- |
| `error`            | `Error \| null`               | `undefined`              | Error object for details   |
| `message`          | `string`                      | `undefined`              | Custom error message       |
| `title`            | `string`                      | `"Something went wrong"` | Error title                |
| `onRetry`          | `() => void \| Promise<void>` | `undefined`              | Custom retry function      |
| `retryText`        | `string`                      | `"Try again"`            | Button text                |
| `className`        | `string`                      | `""`                     | Additional CSS classes     |
| `autoRefresh`      | `boolean`                     | `false`                  | Auto-refresh page          |
| `refreshDelay`     | `number`                      | `3000`                   | Delay in ms before refresh |
| `showErrorDetails` | `boolean`                     | `false`                  | Show full error details    |

Choose the pattern that best fits your use case! The component is flexible enough to handle everything from simple error displays to complex retry logic with auto-refresh.