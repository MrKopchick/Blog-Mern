export default (req, res,) => {
    const errors = valdiationResult(result);
    if(!errors.isEmpty()){  
        return res.status(400).json(errors.array());
    }
    
    next();
}