export const signup =(req,res) => {
    const { name, email, password } = req.body
    try{
      // hash password
      if(password.length < 8) res.send('password must be at least 8 characters long')
      // create user    
    }catch(error){
        console.log(error)
    }
}

export const login =(req,res) => {
    
}

export const logout =(req,res) => {
    
}