// "use client";

// import { useFormState } from "react-dom";
// import { loginAction } from "./actions/auth";

// export default function LoginPage() {
//   const [state, action] = useFormState(loginAction, null);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
//         <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
//           Sistem Distribusi Gudang
//         </h1>

//         <form action={action} className="space-y-4">
//           {/* Username */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Username
//             </label>
//             <input
//               name="username"
//               type="text"
//               required
//               className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               placeholder="Masukkan username"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               name="password"
//               type="password"
//               required
//               className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               placeholder="********"
//             />
//           </div>

//           {/* Error Message */}
//           {state?.message && (
//             <div className="rounded bg-red-100 p-2 text-center text-sm text-red-600">
//               {state.message}
//             </div>
//           )}

//           {/* Button */}
//           <button
//             type="submit"
//             className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
//           >
//             Masuk Sistem
//           </button>
//         </form>

//         <div className="mt-4 text-center text-xs text-gray-500">
//           <p>Role Login Tersedia:</p>
//           <p>distributor / admin123</p>
//           <p>gudang / admin123</p>
//           <p>manajemen / manager123</p>
//         </div>
//       </div>
//     </div>
//   );
// }
