import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { PortalLayout } from './layouts/PortalLayout';
import { PublicLayout } from './layouts/PublicLayout';

// Public Pages
import { AboutPage } from './pages/public/AboutPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Farmer Portal Pages
import { AssistantPage } from './pages/farmer/AssistantPage';
import { ConsultationDetailsPage } from './pages/farmer/ConsultationDetailsPage';
import { DiseaseDetectionPage } from './pages/farmer/DiseaseDetectionPage';
import { ExpertsPage } from './pages/farmer/ExpertsPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FarmerProfilePage } from './pages/farmer/FarmerProfilePage';
import { FarmerSettingsPage } from './pages/farmer/FarmerSettingsPage';
import { KnowledgeArticlePage } from './pages/farmer/KnowledgeArticlePage';
import { KnowledgeCenterPage } from './pages/farmer/KnowledgeCenterPage';
import { NewConsultationPage } from './pages/farmer/NewConsultationPage';
import { ScanHistoryPage } from './pages/farmer/ScanHistoryPage';
import { ScanResultsPage } from './pages/farmer/ScanResultsPage';
import { SupportRequestsPage } from './pages/farmer/SupportRequestsPage';
import { WeatherAdvisoryPage } from './pages/farmer/WeatherAdvisoryPage';

// Expert Portal Pages
import { ExpertDashboard } from './pages/expert/ExpertDashboard';
import { ExpertFarmerHistoryPage } from './pages/expert/ExpertFarmerHistoryPage';
import { ExpertProfilePage } from './pages/expert/ExpertProfilePage';
import { ExpertRequestDetailsPage } from './pages/expert/ExpertRequestDetailsPage';
import { ExpertRequestsPage } from './pages/expert/ExpertRequestsPage';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* Protected Farmer Portal */}
                <Route element={<ProtectedRoute allowedRole="farmer" />}>
                  <Route element={<PortalLayout role="farmer" />}>
                    <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                    <Route
                      path="/farmer/disease-detection"
                      element={<DiseaseDetectionPage />}
                    />
                    <Route path="/farmer/scan-results/:id" element={<ScanResultsPage />} />
                    <Route path="/farmer/scan-history" element={<ScanHistoryPage />} />
                    <Route path="/farmer/weather" element={<WeatherAdvisoryPage />} />
                    <Route path="/farmer/assistant" element={<AssistantPage />} />
                    <Route path="/farmer/experts" element={<ExpertsPage />} />
                    <Route
                      path="/farmer/consultation/new"
                      element={<NewConsultationPage />}
                    />
                    <Route
                      path="/farmer/consultation/requests"
                      element={<SupportRequestsPage />}
                    />
                    <Route
                      path="/farmer/consultation/:id"
                      element={<ConsultationDetailsPage />}
                    />
                    <Route path="/farmer/knowledge" element={<KnowledgeCenterPage />} />
                    <Route
                      path="/farmer/knowledge/:id"
                      element={<KnowledgeArticlePage />}
                    />
                    <Route path="/farmer/profile" element={<FarmerProfilePage />} />
                    <Route path="/farmer/settings" element={<FarmerSettingsPage />} />
                  </Route>
                </Route>

                {/* Protected Agricultural Expert Portal */}
                <Route element={<ProtectedRoute allowedRole="expert" />}>
                  <Route element={<PortalLayout role="expert" />}>
                    <Route path="/expert/dashboard" element={<ExpertDashboard />} />
                    <Route
                      path="/expert/requests"
                      element={<ExpertRequestsPage mode="all" />}
                    />
                    <Route
                      path="/expert/assigned"
                      element={<ExpertRequestsPage mode="assigned" />}
                    />
                    <Route
                      path="/expert/respond"
                      element={<ExpertRequestsPage mode="respond" />}
                    />
                    <Route
                      path="/expert/requests/:id"
                      element={<ExpertRequestDetailsPage />}
                    />
                    <Route path="/expert/history" element={<ExpertFarmerHistoryPage />} />
                    <Route path="/expert/profile" element={<ExpertProfilePage />} />
                    <Route path="/expert/settings" element={<FarmerSettingsPage />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
