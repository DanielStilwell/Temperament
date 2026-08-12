import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthInit from './components/workspace/AuthInit';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import ResultPage from './pages/ResultPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddObserverPage from './pages/AddObserverPage';
import SaveObserverPage from './pages/SaveObserverPage';
import ObserverDetailPage from './pages/ObserverDetailPage';
import ProWorkspace from './pages/ProWorkspace';
import MaxWorkspace from './pages/MaxWorkspace';
import TaskBuilderPage from './pages/TaskBuilderPage';
import TaskResultPage from './pages/TaskResultPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AuthGuard from './components/workspace/AuthGuard';

export default function App() {
  return (
    <Router>
      <AuthInit>
        <Routes>
          {/* 极简首页 */}
          <Route path="/" element={<LandingPage />} />

          {/* 免费版 */}
          <Route path="/free" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/result" element={<ResultPage />} />

          {/* 注册/登录 */}
          <Route path="/register/:tier" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 隐私政策和服务条款 */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />

          {/* 支付回调 */}
          <Route path="/payment-callback" element={<PaymentCallbackPage />} />

          {/* Pro 工作台 */}
          <Route path="/pro" element={<ProWorkspace />} />

          {/* Max 工作台 */}
          <Route path="/max" element={<MaxWorkspace />} />

          {/* 共用：添加被观察者（需登录 Pro 或 Max） */}
          <Route
            path="/add-observer/pro"
            element={
              <AuthGuard tier="pro">
                <AddObserverPage />
              </AuthGuard>
            }
          />
          <Route
            path="/add-observer/max"
            element={
              <AuthGuard tier="max">
                <AddObserverPage />
              </AuthGuard>
            }
          />

          {/* 保存被观察者（登录用户，但不限定 tier，运行时按 profile.tier 跳转） */}
          <Route path="/save-observer" element={<SaveObserverPage />} />

          {/* 被观察者详情（运行时按 profile.tier 跳转回去，这里做软保护） */}
          <Route path="/observer/:id" element={<ObserverDetailPage />} />

          {/* 任务预判（Pro 和 Max 共用） */}
          <Route
            path="/task/new"
            element={
              <AuthGuard tier="pro" shared>
                <TaskBuilderPage />
              </AuthGuard>
            }
          />
          <Route
            path="/task/:id"
            element={
              <AuthGuard tier="pro" shared>
                <TaskResultPage />
              </AuthGuard>
            }
          />
        </Routes>
      </AuthInit>
    </Router>
  );
}
