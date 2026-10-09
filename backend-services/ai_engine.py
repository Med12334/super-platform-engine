import random

def calculate_routing_efficiency(active_drivers, pending_deliveries):
    if active_drivers == 0:
        return 0.0
    
    # Calculate base ratio of drivers to deliveries
    ratio = active_drivers / max(1, pending_deliveries)
    
    # Simulate AI spatial clustering optimization
    base_score = min(99.9, (ratio * 100) + random.uniform(15.0, 25.0))
    
    # Apply penalty if system is severely overloaded
    if pending_deliveries > (active_drivers * 4):
        base_score -= 12.5
        
    return round(max(10.0, min(99.9, base_score)), 1)
