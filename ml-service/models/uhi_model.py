import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

class UHIModelEngine:
    def __init__(self):
        self.rf_model = None
        self.gb_model = None
        self.lr_model = None
        self.metrics = {}
        self.is_trained = False
        self._train_models()

    def _train_models(self):
        # Generate synthetic Landsat-8 / Sentinel-2 climate training dataset (N=1500 samples)
        np.random.seed(42)
        n_samples = 1500

        # Features:
        # 1. NDVI (Vegetation Index): 0.0 to 0.8
        # 2. Building Density (%): 5.0 to 98.0
        # 3. Impervious Surface Ratio (%): 10.0 to 99.0
        # 4. Relative Humidity (%): 20.0 to 85.0
        # 5. Ambient Air Temp (°C): 25.0 to 42.0

        ndvi = np.random.uniform(0.02, 0.75, n_samples)
        building_density = np.random.uniform(5.0, 98.0, n_samples)
        impervious_ratio = np.random.uniform(10.0, 99.0, n_samples)
        humidity = np.random.uniform(20.0, 85.0, n_samples)
        ambient_temp = np.random.uniform(25.0, 42.0, n_samples)

        # Land Surface Temperature (LST °C) ground-truth equation based on physical microclimate relationships
        # Higher building density & impervious surfaces increase LST; higher NDVI & humidity suppress LST.
        lst = (
            ambient_temp +
            (building_density * 0.12) +
            (impervious_ratio * 0.08) -
            (ndvi * 14.5) -
            (humidity * 0.03) +
            np.random.normal(0, 0.75, n_samples)
        )

        X = pd.DataFrame({
            'ndvi': ndvi,
            'building_density': building_density,
            'impervious_ratio': impervious_ratio,
            'humidity': humidity,
            'ambient_temp': ambient_temp
        })
        y = lst

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # 1. Random Forest Regressor
        self.rf_model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)
        self.rf_model.fit(X_train, y_train)
        rf_preds = self.rf_model.predict(X_test)

        # 2. Gradient Boosting (XGBoost equivalent)
        self.gb_model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
        self.gb_model.fit(X_train, y_train)
        gb_preds = self.gb_model.predict(X_test)

        # 3. Ridge Linear Regression
        self.lr_model = Ridge(alpha=1.0)
        self.lr_model.fit(X_train, y_train)
        lr_preds = self.lr_model.predict(X_test)

        # Compute performance metrics
        self.metrics = {
            "random_forest": {
                "name": "Random Forest Regressor",
                "mae": round(mean_absolute_error(y_test, rf_preds), 3),
                "rmse": round(np.sqrt(mean_squared_error(y_test, rf_preds)), 3),
                "r2": round(r2_score(y_test, rf_preds), 4),
                "status": "Optimal"
            },
            "xgboost": {
                "name": "XGBoost Regressor (Gradient Boosting)",
                "mae": round(mean_absolute_error(y_test, gb_preds), 3),
                "rmse": round(np.sqrt(mean_squared_error(y_test, gb_preds)), 3),
                "r2": round(r2_score(y_test, gb_preds), 4),
                "status": "Recommended"
            },
            "linear_regression": {
                "name": "Ridge Linear Regression",
                "mae": round(mean_absolute_error(y_test, lr_preds), 3),
                "rmse": round(np.sqrt(mean_squared_error(y_test, lr_preds)), 3),
                "r2": round(r2_score(y_test, lr_preds), 4),
                "status": "Baseline"
            }
        }

        self.is_trained = True

    def predict(self, ndvi: float, building_density: float, impervious_ratio: float, humidity: float, ambient_temp: float, model_type: str = "xgboost"):
        if not self.is_trained:
            self._train_models()

        input_data = pd.DataFrame([{
            'ndvi': ndvi,
            'building_density': building_density,
            'impervious_ratio': impervious_ratio,
            'humidity': humidity,
            'ambient_temp': ambient_temp
        }])

        if model_type == "random_forest":
            pred_lst = float(self.rf_model.predict(input_data)[0])
        elif model_type == "linear":
            pred_lst = float(self.lr_model.predict(input_data)[0])
        else:
            pred_lst = float(self.gb_model.predict(input_data)[0])

        # UHI Intensity relative to ambient baseline
        uhi_intensity = max(0.0, pred_lst - ambient_temp)

        # Risk Classification
        if pred_lst >= 46.0:
            risk_level = "EXTREME"
            color = "#ff2a5f"
        elif pred_lst >= 42.0:
            risk_level = "CRITICAL"
            color = "#ff5500"
        elif pred_lst >= 38.0:
            risk_level = "HIGH"
            color = "#ffaa00"
        elif pred_lst >= 34.0:
            risk_level = "MODERATE"
            color = "#0088ff"
        else:
            risk_level = "OPTIMAL"
            color = "#00ff88"

        # Feature importance breakdown (from Random Forest)
        feature_importance = dict(zip(
            ['NDVI', 'Building Density', 'Impervious Ratio', 'Humidity', 'Ambient Temp'],
            [round(float(imp), 3) for imp in self.rf_model.feature_importances_]
        ))

        return {
            "predicted_lst": round(pred_lst, 2),
            "uhi_intensity": round(uhi_intensity, 2),
            "risk_level": risk_level,
            "risk_color": color,
            "used_model": model_type,
            "feature_importance": feature_importance
        }

# Global singleton engine
uhi_engine = UHIModelEngine()
