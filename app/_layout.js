// import { Slot } from "expo-router";
// import { useEffect, useState, createContext } from "react";
// import SplashScreenComponent from "./SplashScreen";
// import { UserProvider, useUserContext } from '../src/contexts/UserContext';
// import "../src/i18n";
// import { RegistrationProvider } from '../src/contexts/RegistrationContext';


// export const RootLayoutContext = createContext(false);

// function RootLayout() {
//   const { isLoading } = useUserContext();
//   const [appIsReady, setAppIsReady] = useState(false);
//   const [isRootReady, setIsRootReady] = useState(false);

//   useEffect(() => {
//     async function prepare() {
//       try {
//         const minAnimationDuration = 5700;
//         const startTime = Date.now();

//         if (!isLoading) {
//           const elapsed = Date.now() - startTime;
//           const remaining = minAnimationDuration - elapsed;
//           if (remaining > 0) {
//             await new Promise(resolve => setTimeout(resolve, remaining));
//           }
//           setAppIsReady(true);
//           setIsRootReady(true);
//         }
//       } catch (e) {
//         console.warn("Prepare error:", e);
//         setAppIsReady(true);
//         setIsRootReady(true);
//       }
//     }
//     prepare();
//   }, [isLoading]);

//   if (!appIsReady) {
//     return <SplashScreenComponent />;
//   }

//   // Render Slot directly instead of Stack
//   return (
//     <RootLayoutContext.Provider value={isRootReady}>
//       <Slot />
//     </RootLayoutContext.Provider>
//   );
// }

// export default function Layout() {
//   return (
//     <UserProvider>
//       <RegistrationProvider>
//         <RootLayout />
//       </RegistrationProvider>
//     </UserProvider>
//   );
// }
import { Slot } from "expo-router";
import { useEffect, useState, createContext } from "react";
import SplashScreenComponent from "./SplashScreen";
import { UserProvider, useUserContext } from '../src/contexts/UserContext';
import "../src/i18n";
import { RegistrationProvider } from '../src/contexts/RegistrationContext';

export const RootLayoutContext = createContext(false);

function RootLayout() {
  const { isLoading } = useUserContext();
  const [appIsReady, setAppIsReady] = useState(false);
  const [isRootReady, setIsRootReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function prepare() {
      try {
        const startTime = Date.now();
        const minAnimationDuration = 5700;

        // Add any pre-loading logic here
        // await Font.loadAsync(...);
        // await anyOtherAsyncTasks();

        // Calculate remaining time for minimum splash screen duration
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(minAnimationDuration - elapsed, 0);
        
        await new Promise(resolve => setTimeout(resolve, remaining));

        if (isMounted) {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn("Prepare error:", e);
        if (isMounted) setAppIsReady(true);
      }
    }

    prepare();
    return () => { isMounted = false; };
  }, []);

  const handleLayout = () => {
    console.log("Layout is ready");
    setIsRootReady(true);
  };

  if (!appIsReady) {
    return <SplashScreenComponent />;
  }

  return (
    <RootLayoutContext.Provider value={isRootReady}>
      {/* Add onLayout handler to the first View inside Slot */}
      <Slot onLayout={handleLayout} />
    </RootLayoutContext.Provider>
  );
}

export default function Layout() {
  return (
    <UserProvider>
      <RegistrationProvider>
        <RootLayout />
      </RegistrationProvider>
    </UserProvider>
  );
}