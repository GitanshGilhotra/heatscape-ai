# Recommendation & Cooling Simulation Service for HEATSCAPE AI

def calculate_green_recommendation(lst: float, ndvi: float, building_density: float, open_space: float = 20.0):
    """
    Ranks optimal cooling interventions based on physical land properties:
    - High building density + low open space -> Green Roofs & Reflective Materials
    - Moderate density + open space -> Urban Tree Canopy & Parks
    - Flood/drainage lines -> Wetland & Water Retention
    """
    recommendations = []

    # Priority score formula
    heat_score = min(100, max(0, (lst - 30.0) * 5.0))
    deficit_score = (1.0 - max(0.0, min(1.0, ndvi))) * 100.0
    density_score = building_density

    overall_priority_rank = round((heat_score * 0.45) + (deficit_score * 0.35) + (density_score * 0.20), 1)

    # 1. Tree Canopy Intervention
    tree_cooling = round(1.5 + (1.0 - ndvi) * 2.8, 2)
    recommendations.append({
        "rank": 1 if open_space >= 15 else 2,
        "type": "Urban Tree Canopy Plantation",
        "category": "Bio-Infrastructure",
        "cooling_delta": f"-{tree_cooling} °C",
        "cooling_value": tree_cooling,
        "feasibility": "HIGH" if open_space >= 20 else "MODERATE",
        "priority_score": round(overall_priority_rank, 1),
        "rationale": f"Zone exhibits a severe vegetation deficit (NDVI {ndvi:.2f}). Planting dense native trees provides immediate shading and evapotranspirational cooling.",
        "icon": "TreePine"
    })

    # 2. Green Roofs
    roof_cooling = round(1.2 + (building_density / 100.0) * 2.1, 2)
    recommendations.append({
        "rank": 1 if building_density >= 75 else 3,
        "type": "Extensive Green Roof Systems",
        "category": "Rooftop Infrastructure",
        "cooling_delta": f"-{roof_cooling} °C",
        "cooling_value": roof_cooling,
        "feasibility": "HIGH" if building_density >= 70 else "MODERATE",
        "priority_score": round(overall_priority_rank * 0.92, 1),
        "rationale": f"High building density ({building_density}%) limits ground space. Retrofitting flat rooftops with Sedum vegetation absorbs thermal radiation.",
        "icon": "Building2"
    })

    # 3. High-Albedo Reflective Coating
    albedo_cooling = round(1.0 + (building_density / 100.0) * 1.6, 2)
    recommendations.append({
        "rank": 2 if building_density >= 85 else 4,
        "type": "High-Albedo Reflective Pavement & Roofs",
        "category": "Surface Materials",
        "cooling_delta": f"-{albedo_cooling} °C",
        "cooling_value": albedo_cooling,
        "feasibility": "HIGH",
        "priority_score": round(overall_priority_rank * 0.85, 1),
        "rationale": "Applying cool pavement coatings (SRI > 78) reflects 80%+ of incoming solar radiation back into space.",
        "icon": "Sun"
    })

    # Sort recommendations by rank
    recommendations.sort(key=lambda x: x["rank"])

    return {
        "overall_priority_score": overall_priority_rank,
        "priority_level": "URGENT" if overall_priority_rank >= 80 else ("HIGH" if overall_priority_rank >= 60 else "MODERATE"),
        "top_recommendations": recommendations
    }


def simulate_cooling_scenario(base_lst: float, tree_cover_pct: float, green_roof_pct: float, reflective_surface_pct: float):
    """
    Simulates projected temperature drop based on green infrastructure adoption percentages.
    """
    tree_drop = (tree_cover_pct / 100.0) * 4.2
    roof_drop = (green_roof_pct / 100.0) * 2.8
    reflective_drop = (reflective_surface_pct / 100.0) * 2.1

    # Synergistic cooling interaction factor
    total_drop = (tree_drop + roof_drop + reflective_drop) * 0.92
    projected_lst = max(24.0, base_lst - total_drop)
    net_cooling = base_lst - projected_lst

    # Mitigation efficacy rating
    if net_cooling >= 5.0:
        efficacy = "TRANSFORMATIVE"
    elif net_cooling >= 3.0:
        efficacy = "SUBSTANTIAL"
    elif net_cooling >= 1.0:
        efficacy = "MODERATE"
    else:
        efficacy = "MINIMAL"

    return {
        "base_lst": round(base_lst, 2),
        "projected_lst": round(projected_lst, 2),
        "cooling_delta": round(net_cooling, 2),
        "tree_impact": round(tree_drop, 2),
        "green_roof_impact": round(roof_drop, 2),
        "reflective_impact": round(reflective_drop, 2),
        "efficacy_rating": efficacy
    }
